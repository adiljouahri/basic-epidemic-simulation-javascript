let PROBA_DEATH = 100  // the black plague was 100%. smallpox was ~30%-35%
let CONTAGION_RATE = 4.5  // This is the R0 factor. Number of people an individual will infect on average

let PROBA_INFECT = CONTAGION_RATE * 10
let conti = false;
let VACCINATION_RATE = 50
let SIMULATION_SPEED = 25   // time between days in milliseconds. 0: fastest.
// 500 means every day the simulation pauses for 500                     //25 is good for watching
const nb_rows = 50;
const Rayon = 20;//Rayon of circle
const colors = {
  WHITE: [255, 255, 255],
  BLUE: [0, 0, 255],
  GREEN: [0, 255, 0],
  RED: [255, 0, 0]
}

const CONTAGION_RATE_Value = document.getElementById('CONTAGION_RATE_Value')
const PROBA_DEATH_Value = document.getElementById('PROBA_DEATH_Value');
const root = document.getElementById('root');

class person_C {
  constructor(X, Y, C, V) {
    this.X = X;
    this.Y = Y;
    this.color = C;
    this.Vaccinate = V;
    this.dead = false;
    this.sick = 0;

  }
  draw() {
    beginShape();
    noStroke();
    fill(color(this.color));
    ellipse(this.X, this.Y, Rayon, Rayon);
    endShape(CLOSE);
  }
  setColor(newColor) {//set Color
    this.color = newColor;
  }
  getPosition() {
    return { X: this.X, Y: this.Y }
  }
  hide() {//hide object
    this.color = color(colors.WHITE)
  }



}

class People_C {//constructor 
  //the Peoples
  constructor(nb_rows, nb_cols) {
    this.nb_rows = nb_cols;
    this.nb_cols = nb_cols;
    this.all = new Array();
    this.Default_X = Rayon;
    this.Default_Y = Rayon;
    this.sick_List = [];
    this.startDisease = false;
    this.NBDead = 0;
    this.NBInfected = 0;
    this.PROBA_DEATH = PROBA_DEATH;
    this.CONTAGION_RATE = CONTAGION_RATE;
    this.PROBA_INFECT = this.CONTAGION_RATE * 10;
    this.VACCINATION_RATE = VACCINATION_RATE;
    this.s = true;
  }
  set(arg, value) {
    this[arg] = value;
    console.log(this[arg])

  }
  init() {
    let r = 0, c, Person;
    this.all = new Array(this.nb_rows);
    for (; r < this.nb_rows; r++) {
      this.all[r] = new Array(this.nb_cols);
      this.Default_X += 1.5 * Rayon

      for (c = 0; c < this.nb_cols; c++) {
        this.Default_Y += 1.5 * Rayon
        this.all[r][c] = new person_C(this.Default_X, this.Default_Y, colors.BLUE, false)
        // console.log(this.Default_X, this.Default_Y)



      }
      this.Default_Y = Rayon
    }//here

    //55=10

    console.log(this.all)
  }
  draw() {
    // console.log(this.all)

    let r = 0, c = 0;
    for (; r < this.nb_rows; r++) {
      for (c = 0; c < this.nb_cols; c++) {
        if (this.all[r][c].Vaccinate) {
          this.all[r][c].setColor(color(colors.GREEN));
        } else if (this.all[r][c].dead) {
          this.all[r][c].setColor(color(colors.WHITE));
        } else if (this.all[r][c].sick >= 10) {
          this.all[r][c].setColor(color(colors.RED));
        } else if (this.all[r][c].sick == 0) {
          this.all[r][c].setColor(color(colors.BLUE));
        }
        this.all[r][c].draw();
      }
    }
    this.s = false;
  }
  vaccinate() {
    let r = 0, c = 0;
    for (; r < this.nb_rows; r++) {
      for (c = 0; c < this.nb_cols; c++) {
        if (random(100) < this.VACCINATION_RATE) this.all[r][c].Vaccinate = true;
      }
    }
  }
  get_neighbour(x, y) {
    let incx = random(3)
    let incy = random(3)

    incx = (incx * 1) - 1
    incy = (incy * 1) - 1

    let x2 = x + incx
    let y2 = y + incy

    if (x2 < 0) {
      x2 = 0;
    }
    if (x2 >= this.nb_cols) {
      x2 = this.nb_cols - 1;
    }
    if (y2 < 0) {
      y2 = 0;
    }
    if (y2 >= this.nb_rows) {
      y2 = this.nb_rows - 1;
    }

    return [x2, y2]
  }
  spreadDisease(People, conti) {
    if (!this.startDisease && People) {//false enter the loop
      let a = random(this.nb_rows), b = random(this.nb_cols)
      const patientZero = this.all[a][b].sick
      this.vaccinate()
      console.log("TCL: People_C -> spreadDisease -> patientZero", a, b)
      if (this.all[a][b].Vaccinate) return People.spreadDisease()
      this.all[a][b].sick = 10;
      this.NBInfected++

      if (!conti) {
        this.startDisease = true;

        return this.draw()

      }
    }

    this.startDisease = true
    // console.log("TCL: People_C -> spreadDisease -> states_temp", this.NBInfected)

    let r = 0, c = 0, neighbour = null, x2, y2;
    let states_temp = this.all;

    for (; r < this.nb_rows; r++) {
      for (c = 0; c < this.nb_cols; c++) {

        if (!this.all[r][c].Vaccinate && !this.all[r][c].dead && this.all[r][c].sick >= 10) {
          // console.log("TCL: People_C -> spreadDisease -> seack++");

          this.all[r][c].sick++;
          if (this.all[r][c].sick >= 20) {
            console.log(this.PROBA_DEATH)
            if (random(99) < this.PROBA_DEATH) {
              // console.log("TCL: People_C -> spreadDiksease -> person dead");
              this.all[r][c].dead = true;
              this.NBDead++;
              this.NBInfected = this.NBInfected - 1
            } else {
              // console.log("TCL: People_C -> spreadDisease -> person live");
              this.all[r][c].sick = 0;
              this.all[r][c].Vaccinate = true;
              this.NBInfected = this.NBInfected - 1
            }

          }
          console.log(this.all[r][c].Vaccinate)
          if (!this.all[r][c].dead && !this.all[r][c].Vaccinate && random(99) < this.PROBA_INFECT) {

            neighbour = this.get_neighbour(r, c)
            x2 = neighbour[0]
            y2 = neighbour[1]
            if (!this.all[x2][y2].Vaccinate && this.all[x2][y2].sick === 0 && this.all[x2][y2]) {
              this.all[x2][y2].sick = 10;
              this.NBInfected = this.NBInfected + 1

              // console.log("TCL: People_C -> spreadDisease -> will infect");

            }
          }

        }


      }

      // this.all = states_temp
    }

    if (this.NBInfected === 0) noLoop()
    this.draw()



  }
}
const random = (a) => Math.floor(Math.random() * a);

const sliderWidth = 200;
const sliderHeight = 50;

let People = new People_C(20, 20)
const PROBA_DEATH_callBack = (e) => {//constructor
  PROBA_DEATH_Value.innerText = e.value;
  console.log("TCL: PROBA_DEATH_callBack -> e.value", Number(e.value))

  People.set("PROBA_DEATH", Number(e.value))
}



const VACCINATION_RATE_callBack = (e) => {//constructor
  document.getElementById('VACCINATION_RATE_Value').innerText = e.value;
  document.getElementById('VACCINATION_RATE_Value').value = e.value;

  People.set("VACCINATION_RATE", Number(e.value))
}
const CONTAGION_RATE_callBack = (e) => {//constructor

  CONTAGION_RATE_Value.innerText = e.value;

  People.set("CONTAGION_RATE", Number(e.value))
  People.set("PROBA_INFECT", Number(e.value) * 10)

}


function setup() {
  People = new People_C(20, 20)

  createCanvas(800, 800);
  People.init();
  People.draw();

  noLoop();

}

function draw() {
  background(255);
  People.spreadDisease(People);
  People.draw()
  console.log(People.PROBA_DEATH)
}
function run() {
  conti = true

  console.log("TCL: run -> run")
  loop();
}

function reload() {
  setup();
}