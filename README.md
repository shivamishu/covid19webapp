# COVID19 Healthcare Assistant

This is a progressive web app which can be installed on any device.
Application's sole purpose is to increase the awareness amongst people about the COVID-19 infection by providing them a single platform – ‘COVID-19 Healthcare Assistant’ wherein they can make use of all the essential services, information and utilities to help fight this pandemic.

# About COVID19 Healthcare Assistant

This application is a non profit project solely to spread the awareness about COVID19 or Coronavirus pandenmic. The application is currently highly helpful for Indian citizens(will be expanded in future). It provides a covid healthcare assistant to take self assesssment test, find essential services for covid19, contact traces within an area, helpline, support etc.

# Features: The application mainly provides below 6 essential services:

### Risk Assessment: Custom(Free) Self-assessment Test to calculate potential health risk and our recommendations for the same. Find Nearby Containment or Hotspot zone(which is built based on the end-users risk assessment results and covid19 cases in that area). Search for any State's or City's current COVID-19 cases trends.
Users who get the assessment result as HIGH or MEDIUM risk based on predetermined parameters get to upload the covid19 test report/result which the local admin of the area could verify and update in the database using our admin panel.

### Essentials: Search for nearby essential services like COVID-19 Testing Labs, Food/Grocery/Medicine Delivery options, Wellness centers, Emergency services, Donation camps, Helplines etc. and get their contact details.

### Contact Tracing: Users who get the assessment result as HIGH or MEDIUM risk get to fill in the details of the other users with whom they have come in contact within a week. Thus, every user at potential risk builds up this database and thus, we perform some computations and analytics to show the possible cluster of users at risk so that they could self-isolate themselves and even get a covid19 test.
We automatically send notification to the users at risk via email/phone to inform the potential risk associated and to take preventive measures.  
This feature could be really helpful even for the companies who have opened/planning to open offices. Employees could use the app to take risk assessment and fill in the details if at risk. With this contact traces database built within a company and our analytics/suggestions, employees/companies could reduce the risk within the company and help contain covid19 within the company.

### Admin Panel: Different projections of the database, various views of the database and all the relevant analytics. We integrated our database with tableau to achieve this.
Admins of the area or the company get to see the list of all the users at the risk, their contact details(in case need to be contacted to provide help/care), the status of the covid19 test result, provision to verify the test result based on the test report uploaded by the user and send alerts to users to remind them to take covid19 test and upload results.  

### Analytics: Track COVID-19 trends, highlights, updates, guidelines, graphs etc.

### Helpline: Get the details of the Indian Government and your State’s Government Helpline Call Centers to raise concerns, get information or ask for help.
This application is completely a non-profit initiative taken by its creators and does not charge for any of its services. User data is highly secured and is never shared with any 3rd party. All the other data is collected from various sources like Google, covid19india, Bing, MoH, ICMR etc.

 # Architecture  
 
 # APIs  
 
https://www.mylightningstorage.com/setaddress  
https://www.mylightningstorage.com/setlocation  
https://www.mylightningstorage.com/symptoms  
https://www.mylightningstorage.com/contacttraces  
https://www.mylightningstorage.com/containmentzones  
https://www.mylightningstorage.com/containmentcities  
https://www.mylightningstorage.com/containmentresults  
https://www.mylightningstorage.com/upload_file  
https://www.mylightningstorage.com/contacttracelist  
https://www.mylightningstorage.com/sendnotification  
https://www.mylightningstorage.com/confirmreport 

 # Screenshots  
 
 # AWS Resources Setup
 
●	App is completely hosted on AWS.  
●	Technical Stack: NodeJS(Backend), HTML5, JavaScript. jQuery, OpenUI5, CSS etc.(Frontend).  
●	EC2: Create the EC2 instance and install NodeJS. Create a snapshot, AMI of EC2 instance with all the required configurations. This AMI will be used by EC2 instances when it gets spawned by Auto scaling policies.  
●	Auto-Scaling Group: Configure the required auto scaling policy to make the system highly-available and highly scalable with min desired instance as 1 and max instance of 2. These configs could be changed anytime as per the requirements.  
●	Elastic Load Balancer: An Application(HTTP HTTPS) load balancer manages the client traffic efficiently. They distribute incoming application traffic load across multiple EC2 instances hosted in multiple Availability Zones. We can have one or more listeners attached to our load balancer to increase application’s availability.  
●	S3: S3 (with Standard S3 storage class) is used to store and manage the user’s covid19 test results uploaded by the users at risk.  
●	S3 - Standard Infrequent Access is used to store objects after 30 days to have faster access to infrequent files. 30 days as the data after a month is of less relevance for contact tracing.  
●	AWS Glacier for S3 bucket: As the content is required only for a year from object’s creation date, so we will move the content to Amazon Glacier (as it is an archival storage for infrequently) after 365 days. This is because data is of less relevance after a year(hopefully assuming the pandemic ends by then).  
●	Cross Region Data Replication: To implement DR, we have used Data Replication of S3 to have Cross Region Replication accommodating fault tolerance. We could also use Disaster Recovery for fault tolerance.  
●	CloudFront: We used Amazon CloudFront to reduce the unnecessary traffic back to S3 origin to help improve latency as well as reduce load on the origin. It caches our content and provides faster access globally. Admins could easily access user reports for verifications.  
●	Transfer Acceleration for S3 Bucket: Transfer Acceleration will take advantage of its globally distributed edge locations. When the data arrives at the nearest edge location, it is routed to automatically internally by Amazon S3 over an optimized network path.  
●	RDS: All the user database is stored here and connected to Tableau for analytics. Currently using RDS on MySQL engine. We could consider using Amazon Aurora in the future. 
●	Route 53: TO BE REGISTERED.  
●	CloudWatch: It is used to log and monitor the auto scaling, EC2, DynamoDB S3 bucket logs etc using Lambda triggers with SNS.  
●	Lambda: We invoke a Lambda function whenever a user uploads the covid19 test result report to S3, log this in CloudWatch using SNS topic and send notifications to potential users at risk(if result is POSITIVE).  
●	SNS: It is used for sending various above notifications using messages, emails and logs.  
●	Amazon Cognito: We have created a user pool for all our admin users to accommodate the access to application and APIs using Cognito Hosted UI for sign and sign up using 2FA and also added social identity providers like Facebook.  
●	Tableau: Integrating with Tableau to track COVID-19 trends, building contact tracing, highlights, updates by tracking the high risk cases.   
●	AI: We might add some other components as well and currently analyzing if AI could help enhance the solution.  
●	Used OpenUI5 with bootstrap to build UI. It is an open source Model View Controller based JavaScript Framework to build generic web applications compatible on all devices: Mobile, Tablets, Laptop, Desktop etc. For Backend, we used NodeJS framework integrated with all our AWS resources and other open source libraries.  


# Local Setup  
Clone the repository: https://github.com/shivamishu/covid19webapp.git .  
You can create an .env file with all the relevant environment variables and use your own AWS credentials to run the application.  
The application's packages could be installed by running npm i --s  
Run the server: node server.js  
Application is available on the localhost port 443.  
 
 
### Author Contact Details:
#### Shivam Shrivastav
#### Praveen Nayak
#### Kunjan Malik
#### Yadnyshree Savant  
covid19healthcare24x7@gmail.com ,   
© All rights reserved.
