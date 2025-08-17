import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '@/entities/Plan';
import { PlanTranslation } from '@/entities/PlanTranslation';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/types/configuration';
import { StripeService } from '@/resources/stripe/stripe.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @Inject() private readonly configService: ConfigService,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(PlanTranslation)
    private readonly planTranslationRepository: Repository<PlanTranslation>,
    private readonly stripeService: StripeService,
  ) {}

  async onApplicationBootstrap() {
    const config = this.configService.get('config') as Configuration;

    const freePlan = await this.stripeService.getProductPrice(
      config.plans.free.id,
    );
    const profesionalPlan = await this.stripeService.getProductPrice(
      config.plans.pro.id,
    );
    const enterprisePlan = await this.stripeService.getProductPrice(
      config.plans.enterprise.id,
    );

    if (!freePlan || !profesionalPlan || !enterprisePlan) {
      throw new Error('Failed to fetch plans from Stripe');
    }

    const freePlanMonth = this.planRepository.create({
      id: 'f1e60216-624e-42f8-ae7a-10a824b7b00e',
      name: freePlan.metadata.name,
      price: (freePlan.unit_amount as number) / 100,
      stripePriceId: config.plans.free.id,
      period: 'month',
      active: true,
    });

    const profesionalPlanMonth = this.planRepository.create({
      id: '5c127079-e577-4780-bb6e-cb1872745807',
      name: profesionalPlan.metadata.name,
      price: (profesionalPlan.unit_amount as number) / 100,
      stripePriceId: config.plans.pro.id,
      period: 'month',
      active: true,
    });

    const enterprisePlanMonth = this.planRepository.create({
      id: '305ca76f-b719-480e-bccd-3847fa6766d1',
      name: enterprisePlan.metadata.name,
      price: (enterprisePlan.unit_amount as number) / 100,
      stripePriceId: config.plans.enterprise.id,
      period: 'month',
      active: true,
    });

    await this.planRepository.save([
      freePlanMonth,
      profesionalPlanMonth,
      enterprisePlanMonth,
    ]);

    await this.planTranslationRepository.save([
      {
        id: '13607d4a-9cc5-4aad-b161-1b74e52d233c',
        locale: 'en',
        description: 'Ideal for individuals and small teams',
        features: [
          '1 user',
          '5 interviews/month',
          'Basic recording (40 min max)',
        ],
        plan: freePlanMonth,
      },
      {
        id: '12db74ac-7822-4ec0-9880-7335cec1bee0',
        locale: 'es',
        description: 'Ideal para individuos y pequeños equipos',
        features: [
          '1 usuario',
          '5 entrevistas/mes',
          'Grabación básica (máx. 40 minutos)',
        ],
        plan: freePlanMonth,
      },
      {
        id: '4a1a9945-5469-4158-8bc3-e393b74aaaf0',
        locale: 'fr',
        description: 'Idéal pour les particuliers et les petites équipes',
        features: [
          '1 utilisateur',
          '5 entretiens/mois',
          'Enregistrement de base (40 min max)',
        ],
        plan: freePlanMonth,
      },
      {
        id: '2ced5fc9-6279-494e-8437-978dcdc153b3',
        locale: 'jp',
        description: '個人や小規模チームに最適',
        features: ['1 ユーザー', '5 インタビュー/月', '基本録音 (最大 40 分)'],
        plan: freePlanMonth,
      },
      {
        id: '59a07dce-482a-4b57-bce6-2ac3de9d874c',
        locale: 'zh',
        description: '适合个人和小团队',
        features: ['1 用户', '5 次采访/月', '基本录音（最多 40 分钟）'],
        plan: freePlanMonth,
      },
    ]);

    await this.planTranslationRepository.save([
      {
        id: 'b3929958-6e20-4852-8228-4a5df70272d6',
        locale: 'en',
        description: 'Ideal for growing teams',
        features: [
          'Unlimited users',
          'Unlimited interviews/user/month',
          'HD recording + transcription',
          'Collaborative evaluation',
          'ATS integrations',
          'Priority support',
          'Customizable templates',
        ],
        plan: profesionalPlanMonth,
      },
      {
        id: '60b61f83-59c9-4cb6-8290-41acbbdf1857',
        locale: 'es',
        description: 'Ideal para equipos en crecimiento',
        features: [
          'Usuarios ilimitados',
          'Entrevistas ilimitadas/usuario/mes',
          'Grabación HD + transcripción',
          'Evaluación colaborativa',
          'Integraciones ATS',
          'Soporte prioritario',
          'Plantillas personalizables',
        ],
        plan: profesionalPlanMonth,
      },
      {
        id: '74e69031-b877-4273-89dd-13f95b893c7e',
        locale: 'fr',
        description: 'Idéal pour les équipes en croissance',
        features: [
          'Utilisateurs illimités',
          'Entretiens illimités/utilisateur/mois',
          'Enregistrement HD + transcription',
          'Évaluation collaborative',
          'Intégrations ATS',
          'Support prioritaire',
          'Modèles personnalisables',
        ],
        plan: profesionalPlanMonth,
      },
      {
        id: '9a767f55-ed20-4459-83ef-9d9a4de28235',
        locale: 'jp',
        description: '成長中のチームに最適',
        features: [
          '無制限のユーザー数',
          'ユーザーごと/月の無制限のインタビュー数',
          'HD録音 + 転写機能',
          '共同評価機能',
          'ATS統合機能',
          '優先サポート機能',
          'カスタマイズ可能なテンプレート機能',
        ],
        plan: profesionalPlanMonth,
      },
      {
        id: '46e00cb5-3741-4433-a197-b68163ed905d',
        locale: 'zh',
        description: '适合成长中的团队',
        features: [
          '无限用户数',
          '每月每用户无限次采访次数',
          '高清录音 + 转录功能',
          '协作评估功能',
          'ATS 集成功能',
          '优先支持功能',
          '可自定义模板功能',
        ],
        plan: profesionalPlanMonth,
      },
    ]);

    await this.planTranslationRepository.save([
      {
        id: 'b3929958-6e20-4852-8228-4a5df70272d6',
        locale: 'en',
        description: 'For large organizations with advanced needs',
        features: [
          'Everything in Professional +',
          'Unlimited interviews',
          'Advanced analytics',
          'SSO & enterprise security',
          'Dedicated onboarding',
          'Full API access',
          '99.9% uptime SLA',
        ],
        plan: enterprisePlanMonth,
      },
      {
        id: '60b61f83-59c9-4cb6-8290-41acbbdf1857',
        locale: 'es',
        description: 'Para organizaciones grandes con necesidades avanzadas',
        features: [
          'Todo en Profesional +',
          'Entrevistas ilimitadas',
          'Analítica avanzada',
          'SSO y seguridad empresarial',
          'Onboarding dedicado',
          'Acceso completo a la API',
          'SLA de tiempo de actividad del 99.9%',
        ],
        plan: enterprisePlanMonth,
      },
      {
        id: '74e69031-b877-4273-89dd-13f95b893c7e',
        locale: 'fr',
        description: 'Pour les grandes organisations avec des besoins avancés',
        features: [
          'Tout en Professionnel +',
          'Entretiens illimités',
          'Analytique avancée',
          'SSO et sécurité d’entreprise',
          'Intégration dédiée',
          'Accès complet à l’API',
          'SLA de disponibilité de 99,9%',
        ],
        plan: enterprisePlanMonth,
      },
      {
        id: '9a767f55-ed20-4459-83ef-9d9a4de28235',
        locale: 'jp',
        description: '高度なニーズを持つ大規模組織向け',
        features: [
          'プロフェッショナルのすべて +',
          '無制限のインタビュー',
          '高度な分析',
          'SSOおよびエンタープライズセキュリティ',
          '専用オンボーディング',
          '完全なAPIアクセス',
          '99.9%の稼働時間SLA',
        ],
        plan: enterprisePlanMonth,
      },
      {
        id: '46e00cb5-3741-4433-a197-b68163ed905d',
        locale: 'zh',
        description: '适用于具有高级需求的大型组织',
        features: [
          '专业版的所有功能 +',
          '无限次采访',
          '高级分析',
          'SSO 和企业安全',
          '专用入职培训',
          '完全的 API 访问',
          '99.9% 的正常运行时间 SLA',
        ],
        plan: enterprisePlanMonth,
      },
    ]);
  }
}
