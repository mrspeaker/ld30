# LD30 entry

Here we goes again!

## ### Post LD... re-think

Left all the old docs below, here's the new plan:

**JUICE ALL THE THINGS!**

Super fast action crazy area instead of boring "pickup" phase:
	
	- Much much faster travelling
	- Don't choose fares - fly around looking for waving guys
	- GUys will have skulls above head.
	- Fly over one to pick up and take fare
	- Other guys/asteroids? will try and chase you down (why?)
	- Use shields to explode them
	- If hit by asteroid, knock out passangers into space.
		- if they die (explode), penalty.

More challenging landing phase:
	
	- Flying things to knock you off course
	- Bonus Pickups?

effects/polish:

	- screen shake on asteroid hit
	- Rainbow strand "burnout lines"
	- burnout sound
	- more character to taxi
	- better planets

#OLD DOCS FOR LD30

## Connected World Cabs

- You're a cab driver, talking people between planets
- Search for fares, and navigate to the planet
- Land and pick up, then fly to destination planet
- Collect fare.

- Areas have different levels of danger
- Safe areas, nothing happens === lower fares
- Dangerous areas, people shooting at you, falling landscape === higher fares

- Upgrade, refuel stops.
	- buy ammo
	- buy shields for space

- If you run out of fuel, you crash on a planet... 
	- In space? Depot will come get you eventually... can be dangerous
- When you crash? depot spots you new thing, costs money. 

- If you're broke, game over.

- Güber rank will rank you in the universe. Start "unranked"... build up - easier to get better, more dangerous fares with good rank.

## Style

Dystopian future: Connected Worlds, in a disconnected era.

You are Han-Solo type character, just trying to make a buck. 

Go wacky on this one: rainbow thrusters, sparkly particles, wacky song?


## TODOs

### Asteroids Area

* Fly around [DONE]
	* breaking [DONE]
	* smooth turning [DONE]
* Generate levels [DONE]
	* No overlaps [DONE]
* Minimap [DONE]
* Generate fares [DONE]
	* From easy to difficult [DONE]
* Fare display / selecting [DONE]
	* Abort fare [DONE]
	* Point arrow to target [DONE]
* Detect approach to planet [DONE]
	* Make sure not going too fast [DONE]
	* Ensure nice take off pos [DONE]

* Bad guys
* Bad guy firing
* You firing
* Shields

### Lunar Lander Areas

* Get ready screen [DONE]
* Rotational acceleration [DONE]
* Landing physics [DONE]
* Crashing [DONE]
* Generating/drawing landscape [DONE]
	* +- cash rewards for harder landing areas [DONE]
	* Add layers to canvas drawer [DONE]
* Generating pads [DONE]
* Level design [DONE-ish]
* Detecting successful landing [DONE]
* "Judge" landing - give uber points [DONE]

* Fare leaving animation
* Flying pickups?

### Depot Area

* Inventory selection
* Re-fuelling selection

### Screens

* Intro screen [DONE]
* Area screens 
	* Asteroids [DONE]
		* Popup depot screen: give instructions
	* Lunar Lander [DONE]
	* Depot [DONE]
* Game over screen [DONE]

### Tunes

* Flying tune [DONE]
	* With "trouble" variant
* Maybe landing tune


## Add back to Ω500:

* SVG level loader

