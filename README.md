
## Hardware setup (Arduino)

### Installation

- Use Arduino IDE 1.5.x
- Download and copy the ```Adafruit_NFCShield_I2C``` library folder in ```Arduino/libraries``` folder
- Restart Arduino IDE
- Open the sketch 'CardReader'
- Upload the sketch to Arduino with the NFCShield mounted on
- Open the Serial Monitor and collect all the ```card id```


## MovingPostard

### Installation

- Install Node.js 0.12.x like [this](https://nodejs.org/en/blog/release/v0.12.7/) (recent versions won't work due some issue with the serial library)
- Open the Terminal
- Type ```cd ``` and drag and drop the MovingPostcard folder (or type/paste the full path) and hit Enter
- Type ```sudo npm install``` (needs XCode to compile some native modules)



### Prepare a Project

- Collect video or animated gif files in a specific folder somewhere on your computer
- Make sure you have the Arduino Board connected with the correct Sketch
- From the Terminal type ```cd <MovingPostcardPath>``` and hit Enter
- Now type ``` node mp --edit <PathOfTheProjectFolder> --open``` and hit Enter
- Now you should see the editor on your Chrome browser (otherwise point manually to ```http://localhost:3000/editor.html```)
- Use the UI in order to edit your metadata informations (The editor save automatically any changes)
- You can Pair each CardID with a specific content item
- You can generate thumbnails from the video source

A project can be edited in further sessions, existing metadata will be preserved.

**Once you're done, exit from the editor from Terminal by typing ```CTRL + C```. Now you're able to run the Viewer software with ```node mp```.



### Run the software

- Open the Terminal
- Type ```cd ``` and drag and drop the MovingPostcard folder (or type/paste the full path) and hit Enter
- Type ```node mp```

This way the software will run as **viewer** with the config it will find.
Further info should be shown in the Terminal console.
Other options are:

- ```--present [path]``` 'Present Project'
- ```--edit [path]``` 'Edit Project'
- ```--noserial``` 'Disable Serial'
- ```--reset``` 'Reset Project config'
- ```--open``` 'Open the Browser'
- ```--verbose``` 'Verbose mode'







### The Config file

MovingPostcard will use a ```config.json``` file (if present) to run a default project with some other setting (like the USB port Arduino is using)
You can reset it by simply removing it from the MovingPostcard folder or you can edit it as well.


To run the viewer/editor to a specific project folder, simply add the corresponding path link:

	node mp --present <path>
	node mp --edit <path>





