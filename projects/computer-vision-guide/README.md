# Hand gesture recognition in Python using OpenCV

| ![Pointing](media/pointing.gif)
| ![Scissors](media/scissors.gif)
| ![Waving](media/waving.gif) |  

This guide will teach you how to code a computer vision program that recognizes simple hand gestures:
- Pointing
- Scissors (two fingers extended)
- Rock (no fingers extended)
- Waving  

The easiest way to get this running is to use a Jupyter Notebook, which allows you to write your Python 
code in modules and run each individually or as a group.

## Step 1: Get acquainted and plan ahead
Before we do any coding, it's important to think of how we want to approach the task, especially 
because there are multiple ways to code a computer vision program like this one.  

To focus on the user's hand, we can use [background subtraction in OpenCV](https://docs.opencv.org/3.4/d1/dc5/tutorial_background_subtraction.html): basically, we first take a snapshot of the user's background, then we compare all subsequent 
frames to the snapshot and check the difference. Using thresholding, we can highlight the difference between the two images 
to find the object of interest (in this case, the user's hand).  

To make the thresholding easier, we can also focus on only a portion of the window, which will help with both user comfort 
(they won't have to stay off-screen to use the program) and runtime (since less pixels will be checked for gestures).

For recognizing gestures, I found the simplest strategy is to have a "gesture recognizer" with two outputs of different priority:
- one that counts the number of fingers extended, then selects the gesture based on the number (low priority)  
- one that checks how much the center of the hand is moving and how quickly, to check for waving (high priority)  

The priority aspect is important since, if the user's hand is waving quickly, we shouldn't waste time trying to 
count the number of fingers extended (especially since they'll likely be too blurry to count reliably anyway).  

## Step 2: Import libraries and create global variables  
Let's get started! We first have to import the Numpy and OpenCV libraries.  
We also want to declare some global variables that'll be used between multiple functions, such as 
the background, boolean flags for the hand waving, and settings for the window and thresholding.  

```python
import numpy as np
import cv2

# Hold the background for background subtraction.
background = None
# A boolean flag to check if the hand is in the frame.
hand_flag = False
# A boolean flag to check if the hand is moving a lot, which would signify waving.
waving_flag = False
# Two ints to detect how much the center of the hand is moving, by comparing them constantly.
hand_center = 0
prev_hand_center = 0
# And some other useful variables.
frames_elapsed = 0
FRAME_HEIGHT = 200
FRAME_WIDTH = 300
# Try editing these to see how each plays into making the computer vision system more reliable.
CALIBRATION_TIME = 30
BG_WEIGHT = 0.5
OBJ_THRESHOLD = 18
```

## Step 3: Write a loop to get frames from the camera  
Before we can get into the background subtraction, thresholding, and more, we have to write code 
so that the camera can actually take input for processing.  

To get input from your system's first camera, use cv2's VideoCapture function.  
(Note: If it ends up using the wrong camera, try 1, 2, etc. For me, my self-facing camera is 1)  
```python
capture = cv2.VideoCapture(0)
```

And then write a loop immediately after it to actually read frames from the camera constantly, until the user presses x to exit:  
```python
while (True):
    # Store the frame from the video capture and resize it to the window size.
    ret, frame = capture.read()
    frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))

    # Show the previously captured frame.
    cv2.imshow('Camera Input', frame)
    # Check if user wants to exit.
    if (cv2.waitKey(1) & 0xFF == ord('x'))
        break

# When we exit the loop, we have to stop the capture too.
capture.release()
cv2.destroyAllWindows()
```

Great, now our program can take input from the camera! Next up is to begin the thresholding process.

## Step 4: Region of interest  
Now we have to detect the user's hand. Let's first set some values for the region of interest and frame count:   

```python
# Our region of interest will be the top right part of the frame.
region_top = 0
region_bottom = int(2 * FRAME_HEIGHT / 3)
region_left = 0
region_right = int(FRAME_WIDTH / 2)

frames_elapsed = 0
```
(Note: 0,0 is the top left pixel of the frame, and values increase as we move away from that corner.)

Then, within the loop, after capturing the frame and putting its value in ```frame```, we'll clone it. 
This allows us to edit the frame (do thresholding and so on) while being able to return the unedited frame 
for display to the user.  

We can also begin separating the region of interest from the rest of the image, turn it gray (to allow easier 
detection of differences in color/lighting), and apply a Gaussian blur to make edge detection easier.

```python
# Note that we had this written previously. It's just here to help with placing the next lines.
frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))

display_frame = frame.copy()

# Separate the region of interest from the rest of the frame, so we don't process unneeded pixels.
region = frame[region_top:region_bottom, region_left:region_right]
# Put the region into black and white and run a Guassian blur on it to make edge detection easier.
grayed_region = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
grayed_region = cv2.GaussianBlur(grayed_region, (7,7), 0)
```

To make use of the program easier, we'll flip the output frame (so the program works like a mirror) 
and draw a rectangle on-screen to show where the user should put their hand.  

```python
# Flip the frame over the vertical axis so that it works like a mirror, which is more intuitive to the user.
display_frame = cv2.flip(display_frame, 1)

# Draw a rectangle on-screen to show where the user should put their hand.
cv2.rectangle(display_frame, (region_right, region_top), (FRAME_WIDTH, region_bottom), (255,255,255), 2)
```

I'm gonna finish this later because it's 3:43 AM and I have an important call in the morning. TTYL!