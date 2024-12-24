export class Timer {
  constructor(element) {
    this.element = element;
    this.seconds = 0;
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.seconds++;
      this.element.textContent = this.seconds;
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.isRunning = false;
    }
  }

  reset() {
    this.stop();
    this.seconds = 0;
    this.element.textContent = '0';
  }
}