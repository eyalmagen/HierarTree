# HierarTree
HierarTree – eyal magen
Intro:
This project was created by me, in 2017. I just finished my officer course, in there I met Yonatan, who was a researcher. He told me that to create terror organizations trees the researchers use not-fitting programs like word and PowerPoint and asked me to create something better.
Although this project has never published, it was my first web-app project, and I’ve learned a lot in the process of creating it. 
Now, November 2021, 5 years after, I wish to document it.
The code is purely JavaScript, since then I also got to experience React and React native.
Starting Up:
1)	Open cmd in <some directory>
2)	Git clone https://github.com/eyalmagen/HierarTree.git
3)	Run: python -m http.server --cgi 8000
4)	Open chrome and paste: http://localhost:8000/HierarTree/HierarTree/main.html
Features:
This is the Home screen of the app:
 

For convenience I added numbers on that photo to mark different components
 
1,6)
In 6, there are actions which can be made by the user which affect 7 view.
I wanted to allow structural changes as well as styling. Pressing 1 and 2 will change the content of 6 to allow those changes.
Lets start with structural:
Create (alt+n) - Create new cube.
Delete – delete all marked cubes. (I will explain the meaning of marked later.)
Back (alt+z) – implemented using a stack, cancel the last action, can be applied multiple times.
Arrange/horizontal/vertical – Rearrange the mark cubes to be aligned. If non are mark, apply to all.
Streches: change the size of the view 7, and stretching the Rearranging settings.
Template: set the template of the marked cubes.
7)
•	Drag and drop cubes
•	Drag squares on the view to “mark” many cubes:
 
•	Press on the view to unmark marked cubes.
•	You can drag and drop all the marked cubes, they keep their structure.
•	Double click on a cube to start creating a connection. Its “radius” will get bigger. Double click on another cube to connect them. This connection is dynamic-you can move a connected cube. Click on the view to un-select. 
   






2,6)
•	after pressing “Style”, 6 area will look like this:
 
•	Cube color can change the cube color to be gradient:
 
•	The user can also set cube border and lines color.
•	The user can choose an image to put as a background for marked cubes and for the whole view.
•	Cube size can be manipulated as its width and height ratio is determined under “Cube Size”, and after you determine the ratio, Go with the mouse only to the upper border of the cube to enlarge it or making it smaller.
•	After creating cubes, and choosing templates for those cubes, you can use (5) area to determine text font, size, color, and 3 effects: bold. Italic and shadow. Press A to toggle text editing option.
 3)
Press “Present mode” to see the tree you created all over the screen
4) 
Pressing save creates and download the data json serialized to your computer, you can press load to load it later!
The actions stack is not being saved as well, so “back” wont work after loading for actions made in the last session.

Thanks for reading!
Here’s an example of something created with Hirartree:
 
 
