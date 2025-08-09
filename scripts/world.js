import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/Addons.js";

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({color: 0x00d000});

//Since world is a collection of all blocks in the world, we use Group
export class World extends THREE.Group {
  //Type Declarartion
  /**
   * @type {{
   *  id: number,
   *  instanceId: number
   * }[][][]}
   */
  //Data contains what each block is at each x,y,z positions
  data = [];
  //threshold = 0.5;

  params = {
    terrain: {
      scale: 30,
      magnitude: 0.5,
      offset: 0.2
    }
  };

  constructor(size={width:64,height:32}) {
    super();
    this.size = size;
  }

  //Generates world data and meshes
  generate() {
    this.initializeTerrain();
    this.generateTerrain();
    this.generateMeshes();
  }

  //Initializing the world terrain data
  initializeTerrain() {
    this.data = []; //resetting the world
    for(let x=0;x<this.size.width;x++) {
      const slice = [];
      for(let y=0;y<this.size.height;y++) {
        const row = [];
        for(let z=0;z<this.size.width;z++) {
          row.push({ //Object for block
            //id: Math.random() > this.threshold ? 1:0, //For noises
            id: 0,
            instanceId: null
          });
        }
        slice.push(row); //Building the world row by row and concatinating all the row to build the slice and concatinating them to build the world
      }
      this.data.push(slice);
    }
  }

  generateTerrain() {
    const simplex = new SimplexNoise();
    for(let x=0;x<this.size.width;x++) {
      for(let z=0;z<this.size.width;z++) {

        //Compute noise value at x,z position
        const value = simplex.noise(
          x / this.params.terrain.scale, //Larger the scale ,the lesser the noise changes over a particular distance
          z / this.params.terrain.scale
        );

        //Scale the noise based on magnitude qand offset
        const scaledNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;

        //Compute the height of the terrain at x,z position
        let height = Math.floor(this.size.height * scaledNoise);
        height = Math.max(0, Math.min(height, this.size.height-1));

        //Fill in the blocks at each height levels
        for(let y=0;y<=height;y++) {
          this.setBlockId(x,y,z,1);
        }
      }
    }
  }
 
  generateMeshes() {
    this.clear(); //This clearns the already generated world aqnd loads in a new one

    const maxCount = this.size.width * this.size.width * this.size.height; //Totals number of blockss the user can see
    //Instance mesh - Used to render a large number of same geometry and material but with different worlf transformations
    const mesh = new THREE.InstancedMesh(geometry,material,maxCount);
    mesh.count = 0;

    const matrix = new THREE.Matrix4(); //Stores the position of the blocks
    for(let x=0;x<this.size.width;x++) {
      for(let y=0;y<this.size.height;y++) {
        for(let z=0;z<this.size.width;z++) {
          const blockId = this.getBlock(x,y,z).id;
          const instanceId = mesh.count;

          if(blockId !== 0) {
            matrix.setPosition(x+0.5,y+0.5,z+0.5); //Offset
            mesh.setMatrixAt(instanceId,matrix);
            this.setBlockInstanceId(x,y,z,instanceId);
            mesh.count++;
          }
        }
      }
    }

    this.add(mesh);
  }

  //Helper Methods

  /**
   * Gets block data at (x,y,z)
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {{id:number,instanceId:number}}
   */
  getBlock(x,y,z) {
    if(this.inBounds(x,y,z)) {
      return this.data[x][y][z]; //Returns block id and instanceId which determines the typee of the block
    }else {
      return null;
    }
  }

  /**
   * Sets the block id for the block at (x,y,z)
   * @param {number} x
   * @param {number} y 
   * @param {number} z
   * @param {number} id 
   */
  setBlockId(x,y,z,id) {
    if(this.inBounds(x,y,z)) {
      this.data[x][y][z].id = id;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} instanceId
   */
  setBlockInstanceId(x,y,z,instanceId) {
    if(this.inBounds(x,y,z)) {
      this.data[x][y][z].instanceId = instanceId;
    }
  }

  /**
   * Check if the (x,y,z) coordinates are within bounds
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {boolean}
   */
  inBounds(x,y,z) {
    if(x >= 0 && x < this.size.width && y >= 0 && y < this.size.height && z >= 0 && z < this.size.width) {
      return true;
    }else {
      return false;
    }
  }
}