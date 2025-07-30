import { Configuration } from '@/types/configuration';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly plansService: PlansService,
  ) {
    const stripeConf = this.configService.get<Configuration>('config')?.stripe;
    if (!stripeConf?.secretKey) {
      throw new Error('Stripe secret key is not configured');
    }

    this.stripe = new Stripe(stripeConf.secretKey, {
      apiVersion: '2025-06-30.basil',
      appInfo: {
        name: 'ProMeet',
        version: '1.0.0',
        url: 'https://pro-meets.com',
      },
      typescript: true,
    });
  }

  async createCustomer(email: string) {
    return this.stripe.customers.create({ email });
  }

  async createCheckoutSession(params: { customerId: string; priceId: string }) {
    return this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: params.customerId,
      line_items: [{ price: params.priceId, quantity: 1 }],
    });
  }

  async getCustomer(customerId: string) {
    return this.stripe.customers.retrieve(customerId);
  }

  async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
      case 'customer.subscription.pending_update_applied':
      case 'customer.subscription.pending_update_expired':
      case 'customer.subscription.resumed':
      case 'customer.subscription.updated': {
        // const subscription = event.data.object;
        // TODO: Handle subscription events
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  async createSetupIntent(email: string) {
    const user = await this.usersService.findOne({
      select: ['id', 'name', 'phone', 'stripeCustomerId'],
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const createUser = async () => {
      const customer = await this.stripe.customers.create({
        name: user.name,
        email,
        phone: user.phone || undefined,
        metadata: { userId: user.id },
      });
      await this.usersService.update(user.id, {
        stripeCustomerId: customer.id,
      });
      user.stripeCustomerId = customer.id;
    };

    if (!user.stripeCustomerId || user.stripeCustomerId === '') {
      const customer = await this.stripe.customers.list({
        email,
        limit: 1,
      });
      if (customer.data.length > 0) {
        user.stripeCustomerId = customer.data[0].id;
        await this.usersService.update(user.id, {
          stripeCustomerId: user.stripeCustomerId,
        });
      } else {
        await createUser();
      }
    } else {
      const customer = await this.stripe.customers.retrieve(
        user.stripeCustomerId,
      );
      if (!customer || customer.deleted) await createUser();
    }

    const intent = await this.stripe.setupIntents.create({
      customer: user.stripeCustomerId!,
      payment_method_types: ['card'],
    });

    return {
      clientSecret: intent.client_secret,
      customerId: user.stripeCustomerId,
    };
  }

  async attachPaymentMethod(userId: string, paymentMethodId: string) {
    const user = await this.usersService.findOne({
      where: { id: userId },
      select: ['id', 'stripeCustomerId'],
    });

    if (!user?.stripeCustomerId) {
      throw new NotFoundException('User not found');
    }

    const paymentMethod = await this.stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: user?.stripeCustomerId },
    );

    await this.usersService.update(user.id, {
      defaultPaymentMethodId: paymentMethod.id,
    });

    await this.stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethod.id },
    });

    return paymentMethod;
  }

  async detachPaymentMethod(userId: string, paymentMethodId: string) {
    const user = await this.usersService.findOne({
      where: { id: userId },
      select: ['id', 'stripeCustomerId', 'defaultPaymentMethodId'],
    });

    if (!user?.stripeCustomerId) {
      throw new NotFoundException('User not found');
    }

    if (user.defaultPaymentMethodId === paymentMethodId) {
      throw new BadRequestException('Cannot detach the default payment method');
    }

    await this.stripe.paymentMethods.detach(paymentMethodId);

    return { success: true };
  }

  async getPaymentMethods(userId: string) {
    const user = await this.usersService.findOne({
      where: { id: userId },
      select: ['id', 'stripeCustomerId', 'defaultPaymentMethodId'],
    });

    if (!user?.stripeCustomerId) {
      throw new NotFoundException('User not found');
    }

    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    return {
      ...paymentMethods,
      data: paymentMethods.data.map((pm) => ({
        ...pm,
        isDefault: pm.id === user.defaultPaymentMethodId,
      })),
    };
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    const user = await this.usersService.findOne({
      where: { id: userId },
      select: ['id', 'stripeCustomerId'],
    });

    if (!user?.stripeCustomerId) {
      throw new NotFoundException('User not found');
    }

    await this.stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    await this.usersService.update(user.id, {
      defaultPaymentMethodId: paymentMethodId,
    });

    return { success: true };
  }

  async getInvoiceHistory(userId: string) {
    const user = await this.usersService.findOne({
      where: { id: userId },
      select: ['id', 'stripeCustomerId'],
    });

    if (!user?.stripeCustomerId) {
      throw new NotFoundException('User not found');
    }

    const invoices = await this.stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 100,
    });

    return {
      ...invoices,
      data: invoices.data.filter((invoice) => !invoice.deleted),
    };
  }

  async subscribeToPlan(
    userId: string,
    planId: string,
  ): Promise<Stripe.Subscription> {
    const user = await this.usersService.findOne({
      where: { id: userId },
      select: ['id', 'stripeCustomerId'],
    });

    if (!user?.stripeCustomerId) {
      throw new NotFoundException(
        'User not found or does not have a Stripe customer ID.',
      );
    }

    const plan = await this.plansService.findOne({
      where: { id: planId },
      select: ['id', 'stripePriceId'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found.');
    }

    let subscription: Stripe.Subscription;

    const existingSubscriptions = await this.stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active', // O 'trialing', 'past_due' si también quieres considerar esos estados
      limit: 1,
    });

    if (existingSubscriptions.data.length > 0) {
      const currentSubscription = existingSubscriptions.data[0];
      const currentSubscriptionItem = currentSubscription.items.data[0];

      if (currentSubscriptionItem.price.id === plan.stripePriceId) {
        return currentSubscription;
      }

      console.log(
        `Updating subscription ${currentSubscription.id} for customer ${user.stripeCustomerId} from ${currentSubscriptionItem.price.id} to ${plan.stripePriceId}`,
      );

      subscription = await this.stripe.subscriptions.update(
        currentSubscription.id,
        {
          items: [
            {
              id: currentSubscriptionItem.id,
              price: plan.stripePriceId,
            },
          ],

          expand: ['latest_invoice.payment_intent'],
        },
      );
    } else {
      console.log(
        `Creating new subscription for customer ${user.stripeCustomerId} with plan ${plan.stripePriceId}`,
      );
      subscription = await this.stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: plan.stripePriceId }],
        expand: ['latest_invoice.payment_intent'],
      });
    }

    return subscription;
  }

  async getProductPrice(priceId: string): Promise<Stripe.Price> {
    return this.stripe.prices.retrieve(priceId);
  }
}
