import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SortingVisualiser';
  @ViewChild('canvas', { read: ElementRef, static: true })
  private canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('speedController', { static: false })
  private speedController: ElementRef<HTMLInputElement>;

  private ctx: CanvasRenderingContext2D;

  private items = []
  sorting: boolean = false;

  //setinterval variable
  private animate;
  private animationTime = 100;
  private sortingAlgorithm: SortingAlgorithm;

  //heading title, changes when button for algorithm clicked
  algorithmTitle: string;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.setBubbleSort();
    this.setCanvas();
  }

  //create array of 200 random numbers 
  setArray() {
    let temp = []
    let max = 200;
    let min = 1;
    for (let i = 0; i < 200; i++) {
      temp.push(Math.floor(Math.random() * (max - min) + min))
    }
    return temp;
  }


  setCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'red';
    this.items = this.setArray();
    for (let i = 0; i < this.items.length; i++) {
      this.fillIndex(i);
    }

    if (this.sorting) {
      this.sorting = false;
    }
  }

  fillIndex(index: number) {
    this.ctx.fillRect(index * 5 + 1, 600, 4, -3 * this.items[index]);
  }

  paintIndexes(index1: number, index2: number, color: string) {
    this.ctx.fillStyle = color;
    this.fillIndex(index1);
    this.fillIndex(index2);
  }

  clearIndex(index: number) {
    this.ctx.clearRect(index * 5, 600, 5, -600);
  }

  playAnimation() {
    this.setAnimationTimer();
    switch (this.sortingAlgorithm) {
      case SortingAlgorithm.BUBBLE_SORT:
        this.bubbleSort();
        break;
      case SortingAlgorithm.INSERTION_SORT:
        this.insertionSort();
        break;
      case SortingAlgorithm.QUICK_SORT:
        this.setQuickSort();
        break;
      default:
        this.bubbleSort();
        break;
    }
  }
  setAnimationTimer() {
    try {
      let temp = parseInt(this.speedController.nativeElement.value);
      this.animationTime = temp;
    } catch (err) { }
  }

  reset() {
    clearInterval(this.animate);
    this.setCanvas();
  }

  swapItems(index1: number, index2: number) {
    let temp = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = temp;
  }

  /*bubble sort start */
  bubbleSort() {
    this.sorting = true;
    let len = this.items.length;
    let i = 1;
    let swapped = false;
    this.animate = setInterval(() => {
      // check index has reached end of list, if no items swapped clear animation
      if (i - 2 >= 0) {
        this.clearIndex(i - 2);
        this.clearIndex(i - 1);
        this.paintIndexes(i - 1, i - 2, 'red');
      }

      if (i == len) {
        if (swapped) {
          swapped = false;
          i = 1;
          len--;
        } else {
          clearInterval(this.animate);
        }
      }

      if (this.items[i - 1] > this.items[i]) {
        swapped = true;
        this.clearIndex(i - 1);
        this.clearIndex(i);
        this.paintIndexes(i - 1, i, 'blue');
        this.swapItems(i, i - 1)
      }

      i++;
    }, this.animationTime);
  }

  setBubbleSort() {
    this.sortingAlgorithm = SortingAlgorithm.BUBBLE_SORT;
    this.algorithmTitle = 'Bubble Sort';
  }
  /*bubble sort end */

  /**insertion sort start */

  insertionSort() {
    this.sorting = true;
    let index = 1;
    let nextPos = 2;

    this.animate = setInterval(() => {

      this.clearIndex(index);
      this.clearIndex(index + 1);
      this.paintIndexes(index, index + 1, 'red');

      if (nextPos == this.items.length && this.items[index] >= this.items[index - 1]) {
        clearInterval(this.animate);
      }

      if (this.items[index - 1] > this.items[index]) {
        this.paintIndexes(index, index - 1, 'blue');
        this.swapItems(index, index - 1);
        index--;
      } else {
        index = nextPos;
        nextPos++;
      }

    }, this.animationTime);
  }

  setInsertionSort() {
    this.sortingAlgorithm = SortingAlgorithm.INSERTION_SORT;
    this.algorithmTitle = 'Insertion Sort';
  }
  /**insertion sort end */

  /* quick sort start*/

  setQuickSort() {
    this.sortingAlgorithm = SortingAlgorithm.QUICK_SORT;
    this.algorithmTitle = 'Quick Sort';
  }
  /* quick sort end*/
}

export enum SortingAlgorithm {
  BUBBLE_SORT,
  QUICK_SORT,
  MERGE_SORT,
  INSERTION_SORT
}