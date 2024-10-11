require("dotenv").config();
const registrationSuccessfully = (name) => {
  return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<a href="https://bng.live.com/"><img class="logo"
					src="https://mui.com/static/images/avatar/3.jpg" alt="BNG.LIVE"></a>
			<div class="message">Congratulations For Registration</div>
			<div class="body">
				<p>Dear <h3>${name},</h3></p>
				<h3>Registration Successfully.</h3>
				<p>Thank you for registering with BNG.live!
                 We're excited to have you join our community.
                  Get ready to explore amazing events, engage with 
                  like-minded individuals, and make the most out of 
                  your experience. Stay tuned for updates and enjoy 
                  the journey with BNG.live!</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:${process.env.MAIL_USER}</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>`;
};
module.exports = registrationSuccessfully;
