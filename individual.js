class Individual extends Organism {
    constructor(board, x, y, energy, aggressiveness, stealth,
        speed, senseRadius, reproductionRate, reproductionThreshold, 
        reproductionEnergy) {
            super(board, x, y);
            // Energy:  an individual's energy level is a combination of health and hunger.
            //          An individual expends energy moving around their environment and 
            //          retrieves/absorbs energy from their environment from eating food.
            //          In the case that two different species individuals attack each other
            //          the individual with the higher energy level wins and absorbs the energy
            //          of the other individual killing them.
            this.energy = float(energy);
            // Speed:   an individual's speed determines how quickly individuals within the
            //          species can move around their environment. An increased speed however,
            //          will also lead to a larger apatite and drain the individual's energy
            //          more quickly.
            this.speed = Math.min(int(speed), 200);
            // SenseRadius:
            //          an individual's sensoryRadius determines how far the individual can
            //          sense the presence of other individuals and food.
            this.senseRadius = Math.min(int(senseRadius), 200);
            // Reproduction Rate:
            //         an individual's reproduction rate will determine how likely the
            //         individual is to spawn an offspring after the reproduction
            //         threshold is met. This is normally in the value of (0.0 - 1.0)
            //         1.0 being that a individual would reproduce every second
            //         and 0.0 being that the individual would never reproduce.
            this.reproductionRate = float(reproductionRate);
            // ReproductionThreshold:
            //         is a value less than 100 at which point the individual
            //         will have the chance of randomly creating an offspring.
            this.reproductionThreshold = int(reproductionThreshold);
            // ReproductionEnergy
            //        is the energy given up to an individual's offspring as
            //        their initial energy value.
            this.reproductionEnergy = int(reproductionEnergy);
            // Aggressiveness:
            //        the aggressiveness of an individual determines if an individual
            //        will go after another individual and attack it.
            this.aggressiveness = Math.min(int(aggressiveness), 150);
            // Stealth:
            //        determines how well an individual is able to hide itself from others.
            //        stealth diminishes with an individual's velocity.
            this.stealth = Math.min(int(stealth), 100);
            // Apatite: is determined by an individual's speed and sensing radius.
            //          Faster individuals and those with a higher sensory radius
            //          will consume more energy on a per second basis than those
            //          with lower values.
            this.apatite = ((0.006/FRAMERATE) * (Math.pow(this.speed-80,2) + Math.pow(this.senseRadius-50,2) + Math.pow(this.aggressiveness,1.2)*0.2+this.stealth*0.3));

            // +-----------------+
            // | Location Values |
            // +-----------------+
            this.targetX = -1;
            this.targetY = -1;
            this.target = null;
            this.maturity = 0;

            this.r = int(((Math.pow(this.aggressiveness/10,2))*3 - this.stealth*0.5)+20);
            this.g = int(((Math.pow((this.speed-15)/10,2))*2 - this.stealth*0.5)+20);
            this.b = int(((Math.pow(this.senseRadius/10,2))*3 - this.stealth*0.5)+20);
        }

    tick() {
        let closest = this.findClosest(this.sense());
        if (closest != null || this.targetX == -1) {
            this.setTarget(closest);
        }
        let hit = boolean(this.moveToTarget());
        if (hit) {
            this.targetX = -1;
            this.targetY = -1;
        }
        if (hit && this.target instanceof Leaf) {
            this.energy += float(this.target.eat());
            this.target = null;
        } else if (hit && this.target instanceof Individual) {
            this.attack(this.target);
            this.target = null;
        }
        if (this.energy > this.reproductionThreshold) {
            if (this.maturity <= FRAMERATE*5) {
                this.maturity++;
            }
            if (this.maturity > FRAMERATE*5 && random() < this.reproductionRate) {
                append(babies, new Individual(this.board, this.posX, this.posY,
                    this.reproductionEnergy, 
                    Math.max(random(20)+this.aggressiveness-10, 0),
                    Math.max(random(20)+this.stealth-10, 0),
                    Math.max(random(20)+this.speed-10,20),
                    Math.max(random(20)+this.senseRadius-10,0),
                    Math.max(random()+this.reproductionRate-0.25,0.1),
                    Math.max(random(20)+this.reproductionThreshold-10,5),
                    Math.max(random(20)+this.reproductionEnergy-10, 20)));
                this.energy = float(this.energy - float(this.reproductionEnergy));
            }
        }
        // Subtract off used energy
        this.energy = this.energy - float(this.apatite);
        if (this.energy <= 0) {
            this.dead = true;
            this.remove();
        }
    }

    drawSelf() {
        // Set point color.
        stroke(this.r, this.g, this.b);
        fill(this.r, this.g, this.b);
        if (this.time < 20) {
            ellipse(this.posX, this.posY, this.time, this.time);
            this.time++;
            return;
        }
        // Draw point on canvas.
        ellipse(this.posX, this.posY, 20, 20);
    }

    getAggressiveness() {
        return this.aggressiveness;
    }

    getStealth() {
        return this.stealth;
    }

    getEnergy() {
        return this.energy;
    }

    giveEnergy(input) {
        this.energy += input;
    }

    attack(other) {
        if (other.getEnergy() + other.getAggressiveness() > (this.energy + this.aggressiveness)) {
            other.giveEnergy(this.energy);
            super.remove();
            this.dead = true;
            return;
        }
        other.remove();
        other.dead = true;
        this.energy += other.getEnergy();
    }

    moveToTarget() {
        let distX = int(this.targetX - this.posX);
        let distY = int(this.targetY - this.posY);
        let distance = int(Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)));
        let diffX = 0.0;
        let diffY = 0.0;
        if (distance >= (this.speed / FRAMERATE*0.55) && distance >= 15) {
            if (this.target instanceof Individual) {
                diffX = (distX / distance) * ((this.speed+this.aggressiveness) / FRAMERATE*0.55);
                diffY = (distY / distance) * ((this.speed+this.aggressiveness) / FRAMERATE*0.55);
            } else {
                diffX = (distX / distance) * ((this.speed) / FRAMERATE*0.55);
                diffY = (distY / distance) * ((this.speed) / FRAMERATE*0.55);
            }
            let newX = int(this.posX + diffX);
            let newY = int(this.posY + diffY);
            while (!this.updatePos(newX, newY)) {
                newX += int(diffX/Math.abs(diffX));
                newY += int(diffY/Math.abs(diffY));
            }
            return false;
        }
        return true;
    }

    setTarget(closest) {
        if (closest instanceof Leaf) {
            this.targetX = closest.posX;
            this.targetY = closest.posY;
        }
        else if (closest instanceof Individual) {
            if (closest.getAggressiveness() < this.aggressiveness) {
                this.targetX = closest.posX;
                this.targetY = closest.posY;
            } else {
                if (this.targetX > windowWidth || this.targetX < 0) {
                    this.targetX = this.posX - (this.posX - closest.posX);
                } else {
                    this.targetX = this.posX + (this.posX - closest.posX);
                }
                if (this.targetY > windowHeight || this.targetY < 0) {
                    this.targetY = this.posY - (this.posY - closest.posY);
                } else {
                    this.targetY = this.posY + (this.posY - closest.posY);
                }
            }
        } else if (this.targetX == -1) {
            this.targetX = random(windowWidth);
            this.targetY = random(windowHeight);
        }
        this.target = board["x:"+Math.floor((this.targetX)/10)+"|y:"+Math.floor((this.targetY)/10)]
    }

    findClosest(input) {
        let closest = null;
        let closestDistance = this.senseRadius;

        for (let near in input) {
            let distance = int(Math.sqrt((Math.pow((input[near].posX - this.posX), 2)) + Math.pow((input[near].posY - this.posY), 2)));
            if (input[near] instanceof Individual && (this.senseRadius - input[near].getStealth() < distance)) {
                continue;
            }
            if (distance <= closestDistance) {
                closestDistance = distance;
                closest = input[near];
            }
        }
        return closest;
    }

    sense() {
        let predators = [];
        let pray = [];
        for (let x = this.posX - this.senseRadius; x < this.posX + this.senseRadius; x+= 10) {
            for (let y = this.posY - this.senseRadius; y < this.posY + this.senseRadius; y+= 10) {
                let here = board["x:"+Math.floor((x)/10)+"|y:"+Math.floor((y)/10)];
                if (here != null && here != this) {
                    if (here instanceof Individual) {
                        if (int(here.getAggressiveness()) > int(this.aggressiveness+15)) {
                            append(predators, here);
                        } else if (int(here.getAggressiveness()) + 15 < int(this.aggressiveness)) {
                            append(pray, here);
                        }
                    } else if (here instanceof Leaf && here.isGrown() && this.r < this.g && this.r < this.b) {
                        append(pray, here);
                    }
                }
            }
        }
        if (predators.length > 0) {
            return predators;
        }
        return pray;
    }


}