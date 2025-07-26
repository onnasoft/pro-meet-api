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
  },
};

export default translations;
