import config from '../config';
type IHtmlData = {
  token?: number;
  userName?: string;
  userEmail?: string;
  userProfileImg?: string;
  txId?: string | null;
  amount?: string | number;
  currencyAmount?: string | number;
  currentAmount?: string | number;
  accountUserName?: string;
  accountPassword?: string;
  accountName?: string;
  failedSavedData?: string;
};
const EmailTemplates = {
  verify: {
    subject: 'Verify for login',
    text: undefined,
    html: (data: IHtmlData) => {
      return `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wealth App</title> 
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #000 !important;
            font-family: Arial, sans-serif;
        }

        .email-box {
            background-color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 400px;
            width: 100%;
            margin: 0 auto; 
        }

         /* mobile screens */
         @media (max-width: 768px) {
            .email-box {
                max-width: 300px; 
            }
        }

        .title, p {
            text-align: center;
        }

        .social-icons {
            text-align: center;
            margin: 20px 0; 
            color: white;
        }

        .social-icons span {
            margin: 0 10px; 
            display: inline-block;
            background-color: #D06F0E;
            border-radius: 50%;
            padding: 10px; 
        }

        .social-icons span a{
            color: #fff;
            text-decoration: none;
        }

        .account-name {
            font-weight: 700;
            font-size: 20px;
            padding-bottom: 10px;
        }

        .btn {
            display: block;
            width: fit-content;
            padding: 12px 40px;
            margin: 30px auto;
            background-color: transparent;
            color: #D06F0E;
            border-radius: 10px;
            outline: none;
            border: 1px solid #D06F0E;
            text-decoration: none;
        }
        
        .end {
            font-size: 14px;
            color: grey !important;
            padding-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-box">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                <tr>
                    <td style="text-align: center;">
                        <img src="${config.mainLogo}" width="200" height="100" alt="" style="vertical-align: middle; margin-right: -15px;"> <br>
                        <!-- <h3 style="display: inline; margin: 0; padding-left: 10px;"> Wealth Promiseland</h3> -->
                    </td>
                </tr>
            </table>
            <h2 class="title">Verify Your Account</h2> <br>
            <h3>Hi there,</h3>
            <p>Kindly Verify your account using this code below.</p>
            <div class="email-box-content">
                <a href="#" class="btn">${data.token}</a>
                <p class="end">
                    This is an automatically generated email please do not reply to this email. 
                    If you face any issues, please contact us at support@wealthapp.live
                </p>
                <hr>
                <div class="social-icons">
                    <span><a href="#"><i class="fa-brands fa-instagram"></i></a></span>
                    <span><a href="#"><i class="fa-brands fa-facebook"></i></a></span>
                </div>
                <p class="end">Copyright &copy; 2024 Wealth App.</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    },
  },
  verifyForgot: {
    subject: 'Otp for forgot password',
    text: undefined,
    html: (data: IHtmlData) => {
      return `
      !DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Wealth App</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #000 !important;
                  font-family: Arial, sans-serif;
              }
      
              .email-box {
                  background-color: white;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                  max-width: 400px;
                  width: 100%;
                  margin: 0 auto; 
              }
      
               /* mobile screens */
               @media (max-width: 768px) {
                  .email-box {
                      max-width: 300px; 
                  }
              }
      
              .title, p {
                  text-align: center;
              }
      
              .social-icons {
                  text-align: center;
                  margin: 20px 0; 
                  color: white;
              }
      
              .social-icons span {
                  margin: 0 10px; 
                  display: inline-block;
                  background-color: #D06F0E;
                  border-radius: 50%;
                  padding: 10px; 
              }
      
              .social-icons span a{
                  color: #fff;
                  text-decoration: none;
              }
      
              .account-name {
                  font-weight: 700;
                  font-size: 20px;
                  padding-bottom: 10px;
              }
      
              .btn {
                  display: block;
                  width: fit-content;
                  padding: 12px 40px;
                  margin: 30px auto;
                  background-color: transparent;
                  color: #D06F0E;
                  border-radius: 10px;
                  outline: none;
                  border: 1px solid #D06F0E;
                  text-decoration: none;
              }
              
              .end {
                  font-size: 14px;
                  color: grey !important;
                  padding-top: 20px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="email-box">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                      <tr>
                          <td style="text-align: center;">
                              <img src="${config.mainLogo}" width="200" height="100" alt="" style="vertical-align: middle; margin-right: -15px;"> 
                              <!-- <h3 style="display: inline; margin: 0; padding-left: 10px;"> Wealth Promiseland</h3> -->
                          </td>
                      </tr>
                  </table>
                  <h2 class="title">Reset your password</h2> <br>
                  <h3>Hi there,</h3>
                  <p>Reset your password using this code below .</p>
                  <div class="email-box-content">
                      <a href="#" class="btn">${data.token}</a>
                      <p class="end">
                          This is an automatically generated email please do not reply to this email. 
                          If you face any issues, please contact us at support@wealthapp.live
                      </p>
                      <hr>
                      <div class="social-icons">
                          <span><a href="#"><i class="fa-brands fa-instagram"></i></a></span>
                          <span><a href="#"><i class="fa-brands fa-facebook"></i></a></span>
                      </div>
                      <p class="end">Copyright &copy; 2024 Wealth App.</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
        `;
    },
  },
  deleteUser: {
    subject: 'Otp for deleting your account',
    text: undefined,
    html: (data: IHtmlData) => {
      return `
      !DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Wealth App</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #000 !important;
                  font-family: Arial, sans-serif;
              }
      
              .email-box {
                  background-color: white;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                  max-width: 400px;
                  width: 100%;
                  margin: 0 auto; 
              }
      
               /* mobile screens */
               @media (max-width: 768px) {
                  .email-box {
                      max-width: 300px; 
                  }
              }
      
              .title, p {
                  text-align: center;
              }
      
              .social-icons {
                  text-align: center;
                  margin: 20px 0; 
                  color: white;
              }
      
              .social-icons span {
                  margin: 0 10px; 
                  display: inline-block;
                  background-color: #D06F0E;
                  border-radius: 50%;
                  padding: 10px; 
              }
      
              .social-icons span a{
                  color: #fff;
                  text-decoration: none;
              }
      
              .account-name {
                  font-weight: 700;
                  font-size: 20px;
                  padding-bottom: 10px;
              }
      
              .btn {
                  display: block;
                  width: fit-content;
                  padding: 12px 40px;
                  margin: 30px auto;
                  background-color: transparent;
                  color: #D06F0E;
                  border-radius: 10px;
                  outline: none;
                  border: 1px solid #D06F0E;
                  text-decoration: none;
              }
              
              .end {
                  font-size: 14px;
                  color: grey !important;
                  padding-top: 20px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="email-box">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                      <tr>
                          <td style="text-align: center;">
                              <img src="${config.mainLogo}" width="200" height="100" alt="" style="vertical-align: middle; margin-right: -15px;"> 
                              <!-- <h3 style="display: inline; margin: 0; padding-left: 10px;"> Wealth Promiseland</h3> -->
                          </td>
                      </tr>
                  </table>
                  <h2 class="title">Delete your account</h2> <br>
                  <h3>Hi there,</h3>
                  <p>Delete your account using this code below .</p>
                  <div class="email-box-content">
                      <a href="#" class="btn">${data.token}</a>
                      <p class="end">
                          This is an automatically generated email please do not reply to this email. 
                          If you face any issues, please contact us at support@wealthapp.live
                      </p>
                      <hr>
                      <div class="social-icons">
                          <span><a href="#"><i class="fa-brands fa-instagram"></i></a></span>
                          <span><a href="#"><i class="fa-brands fa-facebook"></i></a></span>
                      </div>
                      <p class="end">Copyright &copy; 2024 Wealth App.</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
        `;
    },
  },
  adminLogin: {
    subject: 'Otp for login your account',
    text: undefined,
    html: (data: { token: number }) => {
      return `
      !DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Wealth App</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #000 !important;
                  font-family: Arial, sans-serif;
              }
      
              .email-box {
                  background-color: white;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                  max-width: 400px;
                  width: 100%;
                  margin: 0 auto; 
              }
      
               /* mobile screens */
               @media (max-width: 768px) {
                  .email-box {
                      max-width: 300px; 
                  }
              }
      
              .title, p {
                  text-align: center;
              }
      
              .social-icons {
                  text-align: center;
                  margin: 20px 0; 
                  color: white;
              }
      
              .social-icons span {
                  margin: 0 10px; 
                  display: inline-block;
                  background-color: #D06F0E;
                  border-radius: 50%;
                  padding: 10px; 
              }
      
              .social-icons span a{
                  color: #fff;
                  text-decoration: none;
              }
      
              .account-name {
                  font-weight: 700;
                  font-size: 20px;
                  padding-bottom: 10px;
              }
      
              .btn {
                  display: block;
                  width: fit-content;
                  padding: 12px 40px;
                  margin: 30px auto;
                  background-color: transparent;
                  color: #D06F0E;
                  border-radius: 10px;
                  outline: none;
                  border: 1px solid #D06F0E;
                  text-decoration: none;
              }
              
              .end {
                  font-size: 14px;
                  color: grey !important;
                  padding-top: 20px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="email-box">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                      <tr>
                          <td style="text-align: center;">
                              <img src="${config.mainLogo}" width="200" height="100" alt="" style="vertical-align: middle; margin-right: -15px;"> 
                              <!-- <h3 style="display: inline; margin: 0; padding-left: 10px;"> Wealth Promiseland</h3> -->
                          </td>
                      </tr>
                  </table>
                  <h2 class="title">Login account</h2> <br>
                  <h3>Hi there,</h3>
                  <p>Login your account using this code below .</p>
                  <div class="email-box-content">
                      <a href="#" class="btn">${data.token}</a>
                      <p class="end">
                          This is an automatically generated email please do not reply to this email. 
                          If you face any issues, please contact us at support@wealthapp.live
                      </p>
                      <hr>
                      <div class="social-icons">
                          <span><a href="#"><i class="fa-brands fa-instagram"></i></a></span>
                          <span><a href="#"><i class="fa-brands fa-facebook"></i></a></span>
                      </div>
                      <p class="end">Copyright &copy; 2024 Wealth App.</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
        `;
    },
  },
  userListAProperty: {
    subject: 'You have successfully listed a new property.',
    html: () => {
      return `
      
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #000 !important;
            font-family: Arial, sans-serif;
        }

        .email-box {
            background-color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 400px; /* Default max-width for larger devices */
            width: 100%;
            margin: 0 auto;
        }

        /* Adjust styles for mobile screens */
        @media (max-width: 768px) {
            .email-box {
                max-width: 300px; /* Smaller max-width for mobile screens */
            }
        }

        .title, p {
            text-align: center;
        }

        .box-row {
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 10px;
            margin-top: 20px;
        }

        .account-name {
            font-weight: 700;
            font-size: 20px;
            padding-bottom: 10px;
        }

        .social-icons {
            text-align: center;
            margin: 20px 0; 
            color: white;
        }

        .social-icons span {
            margin: 0 10px; 
            display: inline-block;
            background-color: #D06F0E;
            border-radius: 50%;
            padding: 10px; 
        }

        .social-icons span a{
            color: #fff;
            text-decoration: none;
        }

        .btn {
            display: block;
            width: fit-content;
            padding: 12px 40px;
            margin: 30px auto;
            background-color: transparent;
            color:  #D06F0E;
            border-radius: 10px;
            outline: none;
            border: 1px solid #D06F0E;
            text-decoration: none;
        }
        
        .end {
            font-size: 14px;
            color: grey !important;
            padding-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-box">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                <tr>
                    <td style="text-align: center;">
                        <img src="${config.mainLogo}" width="200" height="100" alt="" style="vertical-align: middle; margin-right: -15px;"> 
                    </td>
                </tr>
            </table>
            <h2 class="title">Congratulations!</h2>
            <p>You have successfully listed a new property.</p>
            <div class="email-box-content">
                <a href="#" class="btn">View</a>
                <p class="end">
                    This is an automatically generated email please do not reply to this email. 
                    If you face any issues, please contact us at support@wealthapp.live
                </p>
                <hr>
                <div class="social-icons">
                    <span><a href="#"><i class="fa-brands fa-instagram"></i></a></span>
                    <span><a href="#"><i class="fa-brands fa-facebook"></i></a></span>
                </div>
                <p class="end">Copyright &copy; 2024 Wealth App.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
    },
  },
  orderSuccessful: {
    subject: 'You have purchase a order',
    html: (data: { propertyName: string }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #000 !important;
                font-family: Arial, sans-serif;
            }
    
            .email-box {
                background-color: white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                max-width: 400px; /* Default max-width for larger devices */
                width: 100%;
                margin: 0 auto;
            }
    
            /* Adjust styles for mobile screens */
            @media (max-width: 768px) {
                .email-box {
                    max-width: 300px; /* Smaller max-width for mobile screens */
                }
            }
    
            .title, p {
                text-align: center;
            }
    
            .box-row {
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 10px;
                margin-top: 20px;
            }
    
            .account-name {
                font-weight: 700;
                font-size: 20px;
                padding-bottom: 10px;
            }
    
            .social-icons {
                text-align: center;
                margin: 20px 0; 
                color: white;
            }
    
            .social-icons span {
                margin: 0 10px; 
                display: inline-block;
                background-color: #D06F0E;
                border-radius: 50%;
                padding: 10px; 
            }
    
            .social-icons span a{
                color: #fff;
                text-decoration: none;
            }
    
            .btn {
                display: block;
                width: fit-content;
                padding: 12px 40px;
                margin: 30px auto;
                background-color: transparent;
                color:  #D06F0E;
                border-radius: 10px;
                outline: none;
                border: 1px solid #D06F0E;
                text-decoration: none;
            }
            
            .end {
                font-size: 14px;
                color: grey !important;
                padding-top: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-box">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                    <tr>
                        <td style="text-align: center;">
                            <img src="${config.mainLogo}" width="200" height="100" alt="" style="vertical-align: middle; margin-right: -15px;"> 
                        </td>
                    </tr>
                </table>
                <h2 class="title">Congratulations!</h2>
                <p>You have successfully purchased a new property ${data.propertyName}.</p>
                <div class="email-box-content">
                    <a href="#" class="btn">View</a>
                    <p class="end">
                        This is an automatically generated email please do not reply to this email. 
                        If you face any issues, please contact us at support@wealthapp.live
                    </p>
                    <hr>
                    <div class="social-icons">
                        <span><a href="#"><i class="fa-brands fa-instagram"></i></a></span>
                        <span><a href="#"><i class="fa-brands fa-facebook"></i></a></span>
                    </div>
                    <p class="end">Copyright &copy; 2024 Wealth App.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `,
  },
};
export default EmailTemplates;
