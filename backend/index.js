const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'eu-central-1' });

exports.handler = async (event) => {
    try {
        // Parsing the body from API Gateway
        const body = JSON.parse(event.body);
        const { name, email, role, need } = body;

        // Validating inputs
        if (!name || !email || !need) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ message: "Bad Request: Missing fields" }),
            };
        }

        const params = {
            Destination: {
                ToAddresses: [process.env.DESTINATION_EMAIL],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `Nuovo Lead da Meteora Cloud:\n\nNome: ${name}\nEmail: ${email}\nRuolo: ${role}\nNecessità: ${need}`
                    }
                },
                Subject: {
                    Data: `[Nuovo Lead] - ${role} presso ${name}`
                }
            },
            Source: process.env.DESTINATION_EMAIL // Email verificata in SES
        };

        await ses.sendEmail(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
            },
            body: JSON.stringify({ message: 'Email sent successfully!' }),
        };

    } catch (error) {
        console.error("Error sending email", error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
