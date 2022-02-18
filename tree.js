class Init {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener("resize", this.resize.bind(this), false);
    window.addEventListener("click", this.click.bind(this), false);
    this.resize();
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  }

  click(event) {
    const { clientX } = event;
    new Tree(this.ctx, clientX, this.stageHeight);
  }
}

window.onload = () => {
  new Init();
};

const leavesColors = [
  "rgba(65, 95, 255, 0.01)",
  "rgba(255, 0, 0, 0.01)",
  "rgba(158, 255, 0, 0.01)",
];

class Branch {
  constructor(startX, startY, endX, endY, lineWidth, leavesColor) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.color = leavesColors[leavesColor];
    this.lineWidth = lineWidth;

    this.frame = 20;
    this.cntFrame = 0;

    this.gapX = (this.endX - this.startX) / this.frame;
    this.gapY = (this.endY - this.startY) / this.frame;

    this.currntX = this.startX;
    this.currentY = this.startY;
  }

  drawLeaves(ctx) {
    this.currntX += this.gapX;
    this.currentY += this.gapY;
    ctx.globalCompositeOperation = "destination-over";
    ctx.beginPath();

    ctx.arc(this.startX, this.startY, 20, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  draw(ctx) {
    ctx.globalCompositeOperation = "source-over";
    if (this.cntFrame === this.frame) {
      return true;
    }

    ctx.beginPath();

    this.currntX += this.gapX;
    this.currentY += this.gapY;

    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.currntX, this.currentY);

    if (this.lineWidth < 3) {
      ctx.lineWidth = 0.5;
    } else if (this.lineWidth < 7) {
      ctx.lineWidth = this.lineWidth * 0.7;
    } else if (this.lineWidth < 10) {
      ctx.lineWidth = this.lineWidth * 0.9;
    } else {
      ctx.lineWidth = this.lineWidth;
    }

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";

    ctx.stroke();

    ctx.closePath();

    this.cntFrame++;

    return false;
  }
}

class Tree {
  constructor(ctx, posX, posY) {
    this.ctx = ctx;
    this.posX = posX;
    this.posY = posY;
    this.branches = [];
    this.depth = 11;
    this.leavesColor = Math.floor(Math.random() * 2);
    this.cntDepth = 0;
    this.animation = null;

    this.init();
  }

  init() {
    for (let i = 0; i < this.depth; i++) {
      this.branches.push([]);
    }

    this.createBranch(this.posX, this.posY, -90, 0);
    this.draw();
  }

  createBranch(startX, startY, angle, depth) {
    if (depth === this.depth) return;

    const len = depth === 0 ? this.random(10, 13) : this.random(0, 11);

    const endX = startX + this.cos(angle) * len * (this.depth - depth);
    const endY = startY + this.sin(angle) * len * (this.depth - depth);

    this.branches[depth].push(
      new Branch(
        startX,
        startY,
        endX,
        endY,
        this.depth - depth,
        this.leavesColor
      )
    );

    this.createBranch(endX, endY, angle - this.random(15, 23), depth + 1);
    this.createBranch(endX, endY, angle + this.random(15, 23), depth + 1);
  }

  draw() {
    if (this.cntDepth === this.depth) {
      cancelAnimationFrame(this.animation);
    }

    for (let i = this.cntDepth; i < this.branches.length; i++) {
      let pass = true;

      for (let j = 0; j < this.branches[i].length; j++) {
        pass = this.branches[i][j].draw(this.ctx);

        if (i === this.branches.length - 1) {
          this.branches[i][j].drawLeaves(this.ctx);
        }
      }

      if (!pass) break;
      this.cntDepth++;
    }

    this.animation = requestAnimationFrame(this.draw.bind(this));
  }

  cos(ang) {
    return Math.cos(this.degToRad(ang));
  }
  sin(ang) {
    return Math.sin(this.degToRad(ang));
  }
  degToRad(ang) {
    return (ang / 180.0) * Math.PI;
  }
  random(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }
}
