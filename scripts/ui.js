import {GUI} from "three/addons/libs/lil-gui.module.min.js";

export function createUI(world) {
  const gui = new GUI();

  gui.add(world.size, "width", 8, 128, 1).name("Width"); //Object to manipulate and property of object you want to change
  gui.add(world.size, "height", 8, 64, 1).name("Height");
  //gui.add(world,"generate"); //Button that triggers a method in world
  //gui.add(world,"threshold",0,1).name("Noise"); //Threshold for noise
  
  const terrainFolder = gui.addFolder("Terrain");
  terrainFolder.add(world.params.terrain, "scale", 10, 100).name("Scale");
  terrainFolder.add(world.params.terrain, "magnitude", 0, 1).name("Magnitude");
  terrainFolder.add(world.params.terrain, "offset", 0, 1).name("Offset");

  gui.onChange(() => {
    world.generate();
  })
}