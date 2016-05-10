#### Interface:

##Access endpoint:
http://{hostname}/?app_id={app_id}    

Some public APIs:    
http://{hostname}/?type=public&app_id={app_id}    
Such as for cities information


##Upload endpoint:

For example: images
1. images local folder;
2. images property name - the name can access the images randomly in other json schema, such as: rlee.carlogo;

Another example: currency
1. a list defined in json, such as: ['USD', 'RMB', ...]
2. the property name, such as 'currency', which means <account_name>.<property_name> can be accessed from other json schemas.

UI should reflect the endpoint, for example, with a multiple file selection component to select multiple image files, and an editbox to enter property name; for the second example, with an editbox to enter the list of currency, and another editbox to enter the property name: "currency".
