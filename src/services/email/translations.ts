// translations.js
const translations = {
  en: {
    emailVerification: {
      subject: 'Verify your ProMeets account',
      heading: 'Verify your email address',
      greeting: 'Hello {{name}},',
      instructions:
        'Thank you for registering with ProMeets. To complete your registration and verify your email address, please click the button below:',
      button: 'Verify Email Address',
      alternative:
        "If the button doesn't work, copy and paste this link into your browser:",
      expiration: 'This link will expire in {{expiration}} hours.',
      ignore: "If you didn't request this email, you can safely ignore it.",
      footer:
        "You're receiving this email because you signed up for a ProMeets account.",
      copyright: '© {{year}} ProMeets. All rights reserved.',
    },
    passwordReset: {
      subject: 'Reset your ProMeets password',
      heading: 'Reset your password',
      greeting: 'Hello {{name}},',
      instructions:
        'We received a request to reset your password. Click the button below to set a new password:',
      button: 'Reset Password',
      alternative:
        "If the button doesn't work, copy and paste this link into your browser:",
      expiration: 'This link will expire in {{expiration}} hours.',
      ignore:
        "If you didn't request this password reset, you can safely ignore this email.",
      securityNote:
        'For your security, this link will expire after the time indicated above.',
      footer:
        "You're receiving this email because a password reset was requested for your ProMeets account.",
      copyright: '© {{year}} ProMeets. All rights reserved.',
    },
    welcome: {
      subject: 'Welcome to ProMeets!',
      heading: 'Welcome to ProMeets',
      greeting: 'Hello {{name}},',
      message:
        "Thank you for joining ProMeets. We're excited to have you on board!",
      button: 'Go to Dashboard',
      getStarted: 'To get started with ProMeets:',
      step1: 'Complete your profile setup',
      step2: 'Explore our features',
      step3: 'Start scheduling your meetings',
      support:
        "If you need any help, please don't hesitate to contact our support team.",
      footer:
        "You're receiving this email because you recently created a ProMeets account.",
      copyright: '© {{year}} ProMeets. All rights reserved.',
    },
  },
  es: {
    emailVerification: {
      subject: 'Verifica tu cuenta de ProMeets',
      heading: 'Verifica tu dirección de correo',
      greeting: 'Hola {{name}},',
      instructions:
        'Gracias por registrarte en ProMeets. Para completar tu registro y verificar tu dirección de correo, haz clic en el siguiente botón:',
      button: 'Verificar Email',
      alternative:
        'Si el botón no funciona, copia y pega este enlace en tu navegador:',
      expiration: 'Este enlace expirará en {{expiration}} horas.',
      ignore: 'Si no solicitaste este correo, puedes ignorarlo.',
      footer:
        'Estás recibiendo este correo porque creaste una cuenta en ProMeets.',
      copyright: '© {{year}} ProMeets. Todos los derechos reservados.',
    },
    passwordReset: {
      subject: 'Restablece tu contraseña de ProMeets',
      heading: 'Restablecer contraseña',
      greeting: 'Hola {{name}},',
      instructions:
        'Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón para establecer una nueva contraseña:',
      button: 'Restablecer Contraseña',
      alternative:
        'Si el botón no funciona, copia y pega este enlace en tu navegador:',
      expiration: 'Este enlace expirará en {{expiration}} horas.',
      ignore:
        'Si no solicitaste este restablecimiento de contraseña, puedes ignorar este correo.',
      securityNote:
        'Por seguridad, este enlace caducará después del tiempo indicado anteriormente.',
      footer:
        'Estás recibiendo este correo porque se solicitó un restablecimiento de contraseña para tu cuenta de ProMeets.',
    },
    welcome: {
      subject: '¡Bienvenido a ProMeets!',
      heading: 'Bienvenido a ProMeets',
      greeting: 'Hola {{name}},',
      message:
        'Gracias por unirte a ProMeets. ¡Estamos emocionados de tenerte a bordo!',
      button: 'Ir al Panel',
      getStarted: 'Para comenzar con ProMeets:',
      step1: 'Completa la configuración de tu perfil',
      step2: 'Explora nuestras funciones',
      step3: 'Comienza a programar tus reuniones',
      support:
        'Si necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.',
      footer:
        'Estás recibiendo este correo porque recientemente creaste una cuenta en ProMeets.',
      copyright: '© {{year}} ProMeets. Todos los derechos reservados.',
    },
  },
  fr: {
    emailVerification: {
      subject: 'Vérifiez votre compte ProMeets',
      heading: 'Vérifiez votre adresse email',
      greeting: 'Bonjour {{name}},',
      instructions:
        'Merci de vous être inscrit à ProMeets. Pour compléter votre inscription et vérifier votre adresse email, veuillez cliquer sur le bouton ci-dessous :',
      button: "Vérifier l'Email",
      alternative:
        'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
      expiration: 'Ce lien expirera dans {{expiration}} heures.',
      ignore: "Si vous n'avez pas demandé cet email, vous pouvez l'ignorer.",
      footer:
        'Vous recevez cet email parce que vous avez créé un compte ProMeets.',
      copyright: '© {{year}} ProMeets. Tous droits réservés.',
    },
    passwordReset: {
      subject: 'Réinitialisez votre mot de passe ProMeets',
      heading: 'Réinitialiser votre mot de passe',
      greeting: 'Bonjour {{name}},',
      instructions:
        'Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :',
      button: 'Réinitialiser le mot de passe',
      alternative:
        'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
      expiration: 'Ce lien expirera dans {{expiration}} heures.',
      ignore:
        "Si vous n'avez pas demandé cette réinitialisation de mot de passe, vous pouvez ignorer cet email.",
      securityNote:
        'Pour votre sécurité, ce lien expirera après le temps indiqué ci-dessus.',
      footer:
        "Vous recevez cet email parce qu'une réinitialisation de mot de passe a été demandée pour votre compte ProMeets.",
      copyright: '© {{year}} ProMeets. Tous droits réservés.',
    },
    welcome: {
      subject: 'Bienvenue sur ProMeets !',
      heading: 'Bienvenue sur ProMeets',
      greeting: 'Bonjour {{name}},',
      message:
        'Merci de vous être inscrit sur ProMeets. Nous sommes ravis de vous avoir parmi nous !',
      button: 'Accéder au tableau de bord',
      getStarted: 'Pour commencer avec ProMeets :',
      step1: 'Complétez la configuration de votre profil',
      step2: 'Explorez nos fonctionnalités',
      step3: 'Commencez à planifier vos réunions',
      support:
        "Si vous avez besoin d'aide, n'hésitez pas à contacter notre équipe d'assistance.",
      footer:
        'Vous recevez cet email parce que vous avez récemment créé un compte sur ProMeets.',
      copyright: '© {{year}} ProMeets. Tous droits réservés.',
    },
  },
  ja: {
    emailVerification: {
      subject: 'ProMeetsアカウントの確認',
      heading: 'メールアドレスの確認',
      greeting: '{{name}}様、',
      instructions:
        'ProMeetsにご登録いただきありがとうございます。登録を完了し、メールアドレスを確認するには、以下のボタンをクリックしてください：',
      button: 'メールアドレスを確認',
      alternative:
        'ボタンが動作しない場合は、このリンクをブラウザにコピーして貼り付けてください：',
      expiration: 'このリンクは{{expiration}}時間で期限切れになります。',
      ignore:
        'このメールをリクエストしていない場合は、無視しても問題ありません。',
      footer: 'ProMeetsアカウントに登録したため、このメールを受信しています。',
      copyright: '© {{year}} ProMeets. 無断複写・転載を禁じます。',
    },
    passwordReset: {
      subject: 'ProMeetsパスワードのリセット',
      heading: 'パスワードのリセット',
      greeting: '{{name}}様、',
      instructions:
        'パスワードのリセット要求を受け取りました。新しいパスワードを設定するには、以下のボタンをクリックしてください：',
      button: 'パスワードをリセット',
      alternative:
        'ボタンが動作しない場合は、このリンクをブラウザにコピーして貼り付けてください：',
      expiration: 'このリンクは{{expiration}}時間で期限切れになります。',
      ignore:
        'このパスワードリセットをリクエストしていない場合は、このメールを無視してください。',
      securityNote:
        'セキュリティのため、このリンクは上記の時間が経過すると期限切れになります。',
      footer:
        'ProMeetsアカウントのパスワードリセットが要求されたため、このメールを受信しています。',
      copyright: '© {{year}} ProMeets. 無断複写・転載を禁じます。',
    },
    welcome: {
      subject: 'ProMeetsへようこそ！',
      heading: 'ProMeetsへようこそ',
      greeting: '{{name}}様、',
      message:
        'ProMeetsにご参加いただきありがとうございます。あなたをお迎えできて嬉しいです！',
      button: 'ダッシュボードへ移動',
      getStarted: 'ProMeetsを始めるには：',
      step1: 'プロフィールの設定を完了する',
      step2: '機能を探索する',
      step3: 'ミーティングのスケジュールを開始する',
      support: 'サポートが必要な場合は、遠慮なくお問い合わせください。',
      footer:
        'ProMeetsアカウントを最近作成したため、このメールを受信しています。',
      copyright: '© {{year}} ProMeets. 無断複写・転載を禁じます。',
    },
  },
  zh: {
    emailVerification: {
      subject: '验证您的ProMeets账户',
      heading: '验证您的电子邮件地址',
      greeting: '您好 {{name}},',
      instructions:
        '感谢您注册ProMeets。要完成注册并验证您的电子邮件地址，请点击下面的按钮：',
      button: '验证电子邮件地址',
      alternative: '如果按钮不起作用，请将此链接复制并粘贴到您的浏览器中：',
      expiration: '此链接将在{{expiration}}小时后过期。',
      ignore: '如果您没有请求此电子邮件，可以安全地忽略它。',
      footer: '您收到此邮件是因为您注册了ProMeets账户。',
      copyright: '© {{year}} ProMeets. 保留所有权利。',
    },
    passwordReset: {
      subject: '验证您的ProMeets账户',
      heading: '验证您的电子邮件地址',
      greeting: '您好 {{name}},',
      instructions:
        '感谢您注册ProMeets。要完成注册并验证您的电子邮件地址，请点击下面的按钮：',
      button: '验证电子邮件地址',
      alternative: '如果按钮不起作用，请将此链接复制并粘贴到您的浏览器中：',
      expiration: '此链接将在{{expiration}}小时后过期。',
      ignore: '如果您没有请求此电子邮件，可以安全地忽略它。',
      footer: '您收到此邮件是因为您注册了ProMeets账户。',
      copyright: '© {{year}} ProMeets. 保留所有权利。',
    },
    welcome: {
      subject: '欢迎使用ProMeets！',
      heading: '欢迎使用ProMeets',
      greeting: '您好 {{name}},',
      message: '感谢您加入ProMeets。我们很高兴能有您！',
      button: '前往仪表盘',
      getStarted: '开始使用ProMeets：',
      step1: '完成您的个人资料设置',
      step2: '探索我们的功能',
      step3: '开始安排您的会议',
      support: '如果您需要任何帮助，请随时联系我们的支持团队。',
      footer: '您收到此邮件是因为您最近创建了ProMeets账户。',
      copyright: '© {{year}} ProMeets. 保留所有权利。',
    },
  },
};

export default translations;
