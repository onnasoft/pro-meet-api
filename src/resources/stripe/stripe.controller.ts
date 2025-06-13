import { Controller, Post, Req, Res, Headers, HttpCode } from '@nestjs/common';
import { Response, Request } from 'express';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event;

    try {
      event = this.stripeService.handleWebhook(req.body, signature);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const session = event.data.object;
    // Manejo de eventos Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        console.log(`Checkout session completed: ${session.id}`);
        break;
      case 'invoice.payment_succeeded':
        // lógica para pagos exitosos
        break;
      // otros eventos relevantes...
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
}
