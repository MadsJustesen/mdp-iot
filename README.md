# IoT Device Management platform

## System Components
System components are described below:
#### AWS API Gateway
AWS API Gateway routes the HTTPs requests from the user to corresponding Lambda functions.
For controlling access to endpoints, API Gateway can use a feature called Lambda authorizers, where a Lambda function can be used to authenticate and authorize the requester. This can be used in combination with tokens issued by **AMMA** - the internal LEGO API Platform, using users and roles defined in Entra ID to control access to endpoints.
#### AWS Lambda
Lambda runs the business logic. For example, when a user makes a POST request to the /deployments endpoint in the API Gateway, a Lambda function with the name **create-deployment** is invoked and handles the deployment flow.
The Lambda functions are built on the **nodejs** runtime, using **TypeScript**
#### AWS DynamoDB
DynamoDB is a NoSQL database. In this case, it's used for storing the connection state of devices.
#### AWS IoT Core
We mainly use IoT Core for the MQTT broker, partly for publishing messages/commands to the reboot topic, but also for IoT rules that invokes a Lambda function when device connection status messages are received.
#### AWS Greengrass
Greengrass has a cloud component and an edge component. Greengrass can be used in different ways on the edge - in this case I am using Greengrass core on each device. An alternative could have been a greengrass gateway device and greengrass clients on devices.
Deployments are done by doing a CreateDeployment command to Greengrass in the cloud environment. This will use IoT Core to invoke an IoT Job that starts the deployment workflow on targeted devices (device groups)
#### AWS ECR
ECR is Amazons container registry. Used for storing container images for the applications which are to be deployed on devices


# Architecture
![System Architecture](./docs/images/architecture.drawio.svg)

## Reboot flow
![Reboot flowchart](./docs/images/reboot.drawio.svg)

## Create deployment flow
![Create deployment flowchart](./docs/images/create_deployment.drawio.svg)
