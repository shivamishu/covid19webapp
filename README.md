COVID19 Healthcare Assistant<a name="TOP"></a>
===================
      
Application: [URL](https://covid19healthcare.cfapps.us10.hana.ondemand.com/#)
## Introduction

This application's sole purpose is to spread the awareness about COVID19 or Coronavirus pandenmic. The application is currently highly helpful for Indian citizens(will be expanded to USA and other countries in future). It provides a covid healthcare assistant to take self assesssment test, find essential services for covid19, contact traces within an area, several analytical views on the current pandemic, helplines and support.

## Features: The application mainly provides below 6 essential services:

### Risk Assessment: Custom(Free) Self-assessment Test to calculate potential health risk and our recommendations for the same. Find Nearby Containment or Hotspot zone(which is built based on the end-users risk assessment results and covid19 cases in that area). Search for any State's or City's current COVID-19 cases trends.
Users who get the assessment result as HIGH or MEDIUM risk based on predetermined parameters get to upload the covid19 test report/result which the local admin of the area could verify and update in the database using our admin panel.

### Essentials: Search for nearby essential services like COVID-19 Testing Labs, Food/Grocery/Medicine Delivery options, Wellness centers, Emergency services, Donation camps, Helplines etc.  
All the above essential services could be located in a single platform. Users could search for above essenstials services and even service providers could register themselves as trusted partners oferring services. 

### Contact Tracing: Users who get the assessment result as HIGH or MEDIUM risk get to fill in the details of the other users with whom they have come in contact within a week. Thus, every user at potential risk builds up this database and thus, we perform some computations and analytics to show the possible cluster of users at risk so that they could self-isolate themselves and even get a covid19 test.
We automatically send notification to the users at risk via email/phone to inform the potential risk associated and to take preventive measures.  
This feature could be really helpful even for the companies who have opened/planning to open offices. Employees could use the app to take risk assessment and fill in the details if at risk. With this contact traces database built within a company and our analytics/suggestions, employees/companies could reduce the risk within the company and help contain covid19 within the company.

### Admin Panel: Different projections of the database, various views of the database and all the relevant analytics. We integrated our database with tableau to achieve this.
Admins of the area or the company get to see the list of all the users at the risk, their contact details(in case need to be contacted to provide help/care), the status of the covid19 test result, provision to verify the test result based on the test report uploaded by the user and send alerts to users to remind them to take covid19 test and upload results.  

### Analytics: Track COVID-19 trends, highlights, updates, guidelines, graphs etc.

### Helpline: Get the details of the Indian Government and your State’s Government Helpline Call Centers to raise concerns, get information or ask for help.
This application is completely a non-profit initiative taken by its creators and does not charge for any of its services. User data is highly secured and is never shared with any 3rd party. All the other data is collected from various sources like Google, covid19india, Bing, MoH, ICMR etc.

 # Architecture  
   
 ![aws p2](https://user-images.githubusercontent.com/24988178/100217206-342df300-2f39-11eb-8403-22c7d079688c.png)
 
## AWS Resources Setup
 
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
●	Route 53: Registered our domain on Route53 and configured the hosted zones and created records and added record names with various routing policies using dual stack load balancer redirecting all traffic to HTTPS(installed SSL certificates using Certificate Manager).  
●	CloudWatch: It is used to log and monitor the auto scaling, EC2, DynamoDB S3 bucket logs etc using Lambda triggers with SNS.  
●	Lambda: We invoke a Lambda function whenever a user uploads the covid19 test result report to S3, log this in CloudWatch using SNS topic and send notifications to potential users at risk(if result is POSITIVE).  
●	SNS: It is used for sending various above notifications using messages, emails and logs.  
●	Amazon Cognito: We have created a user pool for all our admin users to accommodate the access to application and APIs using Cognito Hosted UI for sign and sign up using 2FA and also added social identity providers like Facebook.  
●	Tableau: Integrating with Tableau to track COVID-19 trends, building contact tracing, highlights, updates by tracking the high risk cases.   
●	AI: We might add some other components as well and currently analyzing if AI could help enhance the solution.  
●	Used OpenUI5 with bootstrap to build UI. It is an open source Model View Controller based JavaScript Framework to build generic web applications compatible on all devices: Mobile, Tablets, Laptop, Desktop etc. For Backend, we used NodeJS framework integrated with all our AWS resources and other open source libraries.  

 ## APIs  
 
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/setaddress 
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/setlocation  
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/symptoms  
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/contacttraces  
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/containmentzones  
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/containmentcities  
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/containmentresults  
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/upload_file 
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/contacttracelist  
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/sendnotification 
https://covid19healthcare.cfapps.us10.hana.ondemand.com/api/confirmreport 


# Screenshots  

![Screenshot (46)](https://user-images.githubusercontent.com/24988178/100579891-049d3300-330b-11eb-9309-79088f0d5bb9.png)
![Screenshot (47)](https://user-images.githubusercontent.com/24988178/100579897-0830ba00-330b-11eb-9894-9ec12818bb41.png)
![Screenshot (48)](https://user-images.githubusercontent.com/24988178/100579903-09fa7d80-330b-11eb-9cb7-23fe28ab5ebc.png)
![Screenshot (49)](https://user-images.githubusercontent.com/24988178/100579909-0bc44100-330b-11eb-91af-3e138c26897f.png)
![Screenshot (50)](https://user-images.githubusercontent.com/24988178/100579915-0e269b00-330b-11eb-935c-58fbfc335630.png)
![Screenshot (51)](https://user-images.githubusercontent.com/24988178/100579923-0ff05e80-330b-11eb-83f6-66620853362b.png)
![Screenshot (52)](https://user-images.githubusercontent.com/24988178/100579930-11ba2200-330b-11eb-9be2-1998f505c89f.png)
![Screenshot (53)](https://user-images.githubusercontent.com/24988178/100579936-1383e580-330b-11eb-8916-bc00a98f15c0.png)
![Screenshot (54)](https://user-images.githubusercontent.com/24988178/100579938-15e63f80-330b-11eb-9d80-d8a530f5d1bf.png)
![Screenshot (55)](https://user-images.githubusercontent.com/24988178/100579945-17b00300-330b-11eb-8c89-4561ab3e59bf.png)
![Screenshot (55)a](https://user-images.githubusercontent.com/24988178/100579952-1979c680-330b-11eb-80a1-b4bb87c076ae.png)
![Screenshot (56)](https://user-images.githubusercontent.com/24988178/100579958-1b438a00-330b-11eb-9575-a46db2aad1a0.png)
![Screenshot (57)](https://user-images.githubusercontent.com/24988178/100579963-1d0d4d80-330b-11eb-87ba-a2e5eba50f77.png)
![Screenshot (57)a](https://user-images.githubusercontent.com/24988178/100579968-1f6fa780-330b-11eb-8ba9-3849c8394252.png)
![Screenshot (58)](https://user-images.githubusercontent.com/24988178/100579975-226a9800-330b-11eb-8259-760178d2c2a3.png)
![Screenshot (59)](https://user-images.githubusercontent.com/24988178/100579982-25fe1f00-330b-11eb-9da9-a0dc1f50de4b.png)
![Screenshot (60)](https://user-images.githubusercontent.com/24988178/100579986-272f4c00-330b-11eb-9a80-8555515df5c9.png)
![Screenshot (61)](https://user-images.githubusercontent.com/24988178/100579988-28607900-330b-11eb-98eb-fb9bf5394e8c.png)
![Screenshot (62)](https://user-images.githubusercontent.com/24988178/100579994-2ac2d300-330b-11eb-9d3a-a7f04564eb03.png)
![Screenshot (63)](https://user-images.githubusercontent.com/24988178/100580001-2bf40000-330b-11eb-962b-320d9dc1d552.png)
![Screenshot (64)](https://user-images.githubusercontent.com/24988178/100580008-2dbdc380-330b-11eb-891f-38dd9b63bb29.png)
![Screenshot iphone](https://user-images.githubusercontent.com/24988178/100580015-2f878700-330b-11eb-86d1-b3f667f5093a.jpg)
  
Demo: https://drive.google.com/file/d/1G-O-yDugNOYv5XaVd8zlYu7JPmpC9fig/view?usp=sharing

# Local Setup  
Clone the repository: https://github.com/shivamishu/covid19webapp.git .  
You can create an .env file with all the relevant environment variables and use your own AWS credentials to run the application.  
The application's packages could be installed by running npm i --s  
Run the server: node server.js  
Application is available on the localhost port 443.  
 
 
### Author Contact Details:
#### Shivam Shrivastav
shivam.ishu@gmail.com  
covid19healthcare24x7@gmail.com  
© All rights reserved.
