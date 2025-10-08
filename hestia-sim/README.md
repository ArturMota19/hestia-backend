<div align="center">
	<img src="https://github.com/hestia-sim/HESTIA-Smart-Home-Simulator/blob/main/doc/img/logo_hestia.png?raw=true" alt="logo" width=400px>
  	<h1>Home Environment Simulator Targeting Inhabitant Activities (HESTIA)</h1>
</div>
<div>
	<p align="center">
		<a href="#sobre">About the generator</a> •
        	<a href="#requirements">Requirements</a> •
        	<a href="#installation">Installation</a> •
		<a href="#scenarios">Scenarios</a> •
		<a href="#responsible">Responsible</a>
	</p>
</div>

<h2 id="sobre"> :eyes: About the generator</h2>

The HESTIA application is a system designed to provide accurate and consistent data on device usage in shared environments, such as homes with multiple residents. The system combines different functionalities to create a virtual environment that faithfully replicates the activities of residents in a shared house. This is achieved through spatial modeling, consideration of user preferences, sensor data collection, and a customizable routine, ensuring that the generated data is accurate and relevant for a wide variety of applications, ranging from home automation to energy consumption analysis.

* **Consistent Data Provision:** The core objective of the application is to offer consistent data that accurately mirrors residents' activities in the house. This is achieved by considering their daily routines and individual preferences. The resulting data reflects a reliable model of user behavior in the residence.

* **Graph Model for Representation:** The application uses a graph model to represent the structure of the house. In this model, each node represents a room, such as bedrooms, bathrooms, and kitchens, and the edges indicate the distance and connection between rooms. This allows the application to create a realistic spatial representation and simulate the movement of residents within the house. The graph model is essential for generating data that accounts for room proximity and the dynamics of daily activities.

* **Routine-Based Data Generation:** The application relies on a predefined weekly routine to create data. This routine covers a wide range of activities, such as sleeping, waking up, taking a shower, cooking, working, listening to music, among others. However, the schedules and frequency of each activity can be customized according to the researcher's needs, resulting in a slight and realistic variation in daily routines.

* **User Preferences Consideration:**  The HESTIA application can utilize individual residents' preferences. This means that specific settings, such as desired room temperature, lighting, or preferences related to smart devices, are taken into account when generating data. The system adjusts routines and parameters to meet the unique preferences of each user.

* **Activity Period Variations:** The system is flexible enough to accommodate natural variations in residents' activity schedules. For example, wake-up or sleep times, or moments for daily activities, may vary from day to day. The application is capable of accommodating these variations to produce data that accurately represents residents' real behavior.

<h2 id="requirements"> :toolbox: Requirements</h2>

* Python 3.10
* Poetry


<h2 id="installation"> :books: Installation and data generation</h2>

First of all, clone the HESTIA project repository to your machine. To do this, run the following commands in the terminal.

```
git clone git@github.com:SSEDG/SSEDG.git
git fetch
git checkout main
git pull
```
To generate a simulated data set for smart environments, simply install the project dependencies:

```
poetry install
```
And by running the command below in the project root directory, the system will be initialized.
````
poetry run python main.py
````
When running it, you will be asked:

- The type of data output (Complete or Simple).
- Number of days to be simulated.
- The routine to be used.

From this, you will have either a Simple or Complete data output. The generated data is stored in the _**/dados**_ folder.


<h2 id="scenarios">:gear: Scenarios</h2>
Some basic routines were created that can be used to produce data. These routines are:

### Grafo_casa-ROTINA_SIMPLES(2usuarios)
*RESIDENTS:* 
Gustavo, Amanda

*SIMPLIFIED ROUTINE:*

* Gustavo: Remote work (8:00-12:00, 14:00-17:00)
* Amanda: In-person work (leaves 7:00, arrives 18:00)
* Weekends: Varied routine (going out, doing laundry)
* Sleeps: at 23:00
* Wakes up: at 6:00

*ACTIVITIES:*
Sleep, Poop, Pee, Take a shower, Brush your teeth, Have breakfast, Have lunch, Have dinner, Cook, Drink water, Work from home, Work outside, Watch TV, Listen to music, Go for a walk, Study, Do laundry, Clean the house

[Full description here.](./doc/Grafo_casa-ROTINA_SIMPLES(2usuarios).md)


### Grafo_casa-ROTINA_SIMPLES(Dividindo_ap)

*RESIDENTS:*
Andre, Vinicius

*SIMPLIFIED ROUTINE:*

* Andre: In-person work (leaves 8:00, arrives 13:00)
* Andre: In-person work (leaves 14:00, arrives 17:00)
* Andre: on Tuesdays and Thursdays, arrives at 19:00
* Andre: sleeps at 00:00, wakes up at 07:00
* Vinicius: In the fourth in-person class (leaves 18:30, arrives 20:30)
* Vinicius: sleeps at 00:00, wakes up at 07:00
* Vinicius: studies at home during the week and goes out occasionally
* Weekends: Varied routine (going for a walk, doing laundry, cleaning the house)


*ACTIVITIES:*
Sleep, Poop, Pee, Take a shower, Brush your teeth, Have breakfast, Have lunch, Have dinner, Cook, Drink water, Work outside, Listen to music, Go for a walk, Study, Clean the house

[Full description here.](./doc/Grafo_casa-ROTINA_SIMPLES(Dividindo_ap).md)


### Grafo_teste-grupo(3usuarios)
*RESIDENTS:*
Gustavo, Amanda, Vitor

*SIMPLIFIED ROUTINE:*

* Gustavo: Goes to the living room to watch TV.
* Gustavo: Leaves the room occasionally.
* Amanda: Prefers to watch TV for long periods and listen to music.
* Amanda: Alternates between watching TV, listening to music, and going out for short periods.
* Vitor: Prioritizes watching TV.
* Vitor: Also occasionally studies in the living room and goes out for long periods.

*ACTIVITIES:*
Sleep, Watch TV, Listen to music, Study, Leave the room, Get home.

[Full description here.](./doc/Grafo_teste-grupo(3usuarios).md)


### Cenario_validacao_Artigo(1usuarios-casa-mayki)
*RESIDENTS:*
Mayki

*SIMPLIFIED ROUTINE:*

* Mayki: Uses the computer in the bedroom at different times of the day and night.
* Mayki: Takes short breaks and leaves the room.
* Mayki: Prepares breakfast, brushes teeth and performs simple activities such as “doing nothing”.
* Mayki: Sleeps regularly for 6 to 8 hours.
* Mayki: Also uses the computer at dawn, especially on weekends.


*ACTIVITIES:*
Sleep, Use the computer, Brush teeth, Prepare breakfast, Do nothing, Leave the room, Go to the balcony, Drink water, Use the bathroom, Prepare a snack, Clean the room.

[Full description here.](./doc/Cenario_validacao_Artigo(1usuarios-casa-mayki).md)


<h2 id="responsible">:office: Responsible</h2>
For more details, contact one of the responsible researchers:

* maykioliveira@ufba.br - Mayki Santos (researcher/developer)
* denis.boaventura@ufba.br  - Denis Robson (researcher/developer)
* joelpires@ufba.br - Joel (researcher)
* eduardoferreira@ufba.br - Eduardo Ferreira (researcher)
* isaque.copque@ufba.br - Isaque(researcher)




