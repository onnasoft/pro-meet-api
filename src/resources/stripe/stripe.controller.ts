import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  HttpCode,
  RawBodyRequest,
  BadRequestException,
  SetMetadata,
  Body,
  Get,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { StripeService } from './stripe.service';
import { Public } from '@/utils/secure';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/types/configuration';
import Stripe from 'stripe';
import { Role } from '@/types/role';
import { User } from '@/entities/User';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
  ) {}

  @Public()
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const config = this.configService.get('config') as Configuration;
    if (!signature) {
      throw new BadRequestException('Stripe signature is required');
    }

    const rawBody = req.body;
    if (!(rawBody instanceof Buffer)) {
      throw new BadRequestException('Request body is required');
    }

    if (!config.stripe || !config.stripe.webhookSecret) {
      throw new BadRequestException('Stripe webhook secret is not configured');
    }

    let event: Stripe.Event;

    try {
      event = Stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripe.webhookSecret,
      );

      await this.stripeService.handleEvent(event);

      return res.status(200).json({ received: true });
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post('create-setup-intent')
  async createSetupIntent(
    @Res() res: Response,
    @Req() req: Express.Request & { user: User },
  ) {
    try {
      const setupIntent = await this.stripeService.createSetupIntent(
        req.user.email,
      );
      return res.status(200).json(setupIntent);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post('attach-payment-method')
  async attachPaymentMethod(
    @Res() res: Response,
    @Req() req: Express.Request & { user: User },
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    if (!paymentMethodId) {
      throw new BadRequestException('Payment method ID is required');
    }

    const paymentMethod = await this.stripeService.attachPaymentMethod(
      req.user.id,
      paymentMethodId,
    );
    return res.status(200).json(paymentMethod);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post('detach-payment-method')
  async detachPaymentMethod(
    @Res() res: Response,
    @Req() req: Express.Request & { user: User },
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    if (!paymentMethodId) {
      throw new BadRequestException('Payment method ID is required');
    }

    const result = await this.stripeService.detachPaymentMethod(
      req.user.id,
      paymentMethodId,
    );
    return res.status(200).json(result);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get('payment-methods')
  async getPaymentMethods(
    @Res() res: Response,
    @Req() req: Express.Request & { user: User },
  ) {
    try {
      const paymentMethods = await this.stripeService.getPaymentMethods(
        req.user.id,
      );
      return res.status(200).json(paymentMethods);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post('set-default-payment-method')
  async setDefaultPaymentMethod(
    @Res() res: Response,
    @Req() req: Express.Request & { user: User },
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    if (!paymentMethodId) {
      throw new BadRequestException('Payment method ID is required');
    }

    const updatedUser = await this.stripeService.setDefaultPaymentMethod(
      req.user.id,
      paymentMethodId,
    );
    return res.status(200).json(updatedUser);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get('invoice-history')
  async getInvoiceHistory(
    @Res() res: Response,
    @Req() req: Express.Request & { user: User },
  ) {
    try {
      const invoices = await this.stripeService.getInvoiceHistory(req.user.id);
      return res.status(200).json(invoices);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
