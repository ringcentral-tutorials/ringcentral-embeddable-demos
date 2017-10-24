Extending the RingCentral Web Widget in Salesforce Lightning.

Here is a step-by-step tutorial for you to create a simple RingCentral to Salesforce integration. So whenever there is an incoming call, the caller's contact page in SalesForce will be popped up. It would also pop up a Google or LinkedIn Search to provid additional information about the person calling.

Believe it or not, you can do it in 10 minutes. Let's start!

First of all you need an SalesForce developer account. Please get one if you don't have one already: https://developer.salesforce.com/signup

![image](https://user-images.githubusercontent.com/733544/30905579-dbdcbfca-a33a-11e7-8e13-15674cce6055.png)

Create an `callcenter.xml` file on your desktop, and copy paste the following content into it:

```xml
<callCenter>
  <section sortOrder="0" name="reqGeneralInfo" label="General Information">
    <item sortOrder="0" name="reqInternalName" label="Internal Name">RingCentralAdapterOpenCTI</item>
    <item sortOrder="1" name="reqDisplayName" label="Display Name">RingCentral Call Center Adapter Open CTI</item>
    <item sortOrder="2" name="reqAdapterUrl" label="CTI Adapter URL">/apex/RCPhone</item>
    <item sortOrder="3" name="reqUseApi" label="Use CTI API">true</item>
    <item sortOrder="4" name="reqSoftphoneHeight" label="Softphone Height">550</item>
    <item sortOrder="5" name="reqSoftphoneWidth" label="Softphone Width">300</item>
    <item sortOrder="6" name="reqSalesforceCompatibilityMode" label="Salesforce Compatibility Mode">Lightning</item>
  </section>
</callCenter>
```

Login your SalesForce developer account. In the "Quick Find" search box search "call center", In "Call Centers", click the "Import" button. Import the `callcenter.xml` file we created above.

![image](https://user-images.githubusercontent.com/733544/30905545-b9f8ef0a-a33a-11e7-929f-54f81f9b083d.png)

Click "Manage Call Center Users" button, add yourself to the call center.

![image](https://user-images.githubusercontent.com/733544/30945813-f742e826-a3c5-11e7-9e67-1c6edded2a1e.png)


Create a VisualForce page named `RCPhone` with following content:

```html
<apex:page>
    <style>
        .hasMotif {
            margin : 0px;
        }
    </style>
    <apex:iframe src="https://embbnux.github.io/ringcentral-widget-demo/app.html" height="500" width="300" frameborder="false"/>
</apex:page>
```

Create new Salesforce app, add a Open CTI Softphone to its utility bar. Launch this app and verify that there is an embedded phone in the utility bar.

![image](https://user-images.githubusercontent.com/733544/30905684-2102da62-a33b-11e7-90c9-698f6a3f16b0.png)

![image](https://user-images.githubusercontent.com/733544/30905775-6dd71254-a33b-11e7-9876-26e55741c6d1.png)


Create an Apex class named `RCPhoneHelper`:

```java
global class RCPhoneHelper {
	webService static Contact searchContact(String phone) {
        List<List<SObject>> l = [FIND :phone IN PHONE FIELDS RETURNING Contact(Id limit 1)];
        if(l.size() > 0 && l[0].size() > 0) {
            String id = ((Contact)l[0][0]).Id;
            return [select Id, Name from Contact where Id=:id limit 1];
        }
        return null;
    }
}
```


Add the following code to `RCPhone` VisualForce page:

```javascript
<script src="/support/api/40.0/lightning/opencti_min.js"></script>
    <script>
        function receiveMessage(event) {
        if(event.data.type === 'rc-call-ring-notify') {
            sforce.opencti.setSoftphonePanelVisibility({ visible: true });
            var fromNumber = event.data.call.from;
            if(fromNumber[0] === '+') {
                fromNumber = fromNumber.substring(1);
            }
            
            sforce.opencti.runApex({ apexClass: 'RCPhoneHelper', methodName: 'searchContact', methodParams: 'phone=' +fromNumber,
                                    callback: function(response) {
                                        if(response.success == true) {
                                            var contact = response.returnValue.runApex;
                                            if(contact !== null) {
                                                sforce.opencti.screenPop({
                                                    type: sforce.opencti.SCREENPOP_TYPE.SOBJECT,
                                                    params: { recordId: contact.Id }
                                                });
                                                window.open('https://www.google.com/search?q=' + contact.Name);
                                            }
                                        }
                                    } 
                                   });
        } 
    }
    window.addEventListener("message", receiveMessage, false);
</script>
```

Save all of the changes to code. Refresh your SalesForce page to make sure that latest changes are applied.

If the incoming call number exists in the contact list in SalesForce, the contact page of that customer will also be opened.

![image](https://user-images.githubusercontent.com/733544/30905909-d1cc3730-a33b-11e7-845e-8d4e929b15d3.png)

We will also Google search the contact's name in  a new browser tab. Please allow your browser to show the popup by the way.

![image](https://user-images.githubusercontent.com/733544/30945908-79d63fa4-a3c6-11e7-8eff-7ffa8c8e47e2.png)

To add a LinkedIn People Search, simply add the following:

`window.open('https://www.linkedin.com/search/results/people/?keywords=' + contact.Name);`
