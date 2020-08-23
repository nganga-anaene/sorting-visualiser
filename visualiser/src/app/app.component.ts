import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, interval, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SortingVisualiser';
  @ViewChild('canvas', { read: ElementRef, static: true })
  private canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('speedController', { static: true })
  private speedController: ElementRef<HTMLInputElement>;

  private ctx: CanvasRenderingContext2D;

  private items = []
  sorting: boolean = false;
  resetArray: boolean = false;

  //setinterval variable
  private animate;
  private animationTime = 50;
  private animationList = [];
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
    this.ctx.fillRect(index * 5 + 1, this.ctx.canvas.height, 4, -2.5 * this.items[index]);
  }

  paintIndexes(index1: number, index2: number, color: string) {
    this.ctx.fillStyle = color;
    this.fillIndex(index1);
    this.fillIndex(index2);
  }

  paintRange(start: number, end: number, color: string) {
    this.ctx.fillStyle = color;
    for (start; start < end; start++) {
      this.clearIndex(start);
      this.fillIndex(start);
    }
  }

  paintIndex(index: number, color: string) {
    this.ctx.fillStyle = color;
    this.clearIndex(index);
    this.fillIndex(index);
  }

  paintCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'red';
    for (let i = 0; i < this.items.length; i++) {
      this.fillIndex(i);
    }
  }

  clearIndex(index: number) {
    this.ctx.clearRect(index * 5, this.ctx.canvas.height, 5, -this.ctx.canvas.height);
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
        this.quicksort();
        break;
      case SortingAlgorithm.MERGE_SORT:
        this.mergeSort();
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
    } catch (err) {
    }
  }

  reset() {
    clearInterval(this.animate);
    for (let i = 0; i < this.animationList.length; i++) {
      clearInterval(this.animationList[i]);
    }
    this.resetArray = false;
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
    this.resetArray = true;
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
    this.reset();
    this.sortingAlgorithm = SortingAlgorithm.BUBBLE_SORT;
    this.algorithmTitle = 'Bubble Sort';
  }
  /*bubble sort end */

  /**insertion sort start */

  insertionSort() {
    this.sorting = true;
    this.resetArray = true;

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
    this.reset();
    this.sortingAlgorithm = SortingAlgorithm.INSERTION_SORT;
    this.algorithmTitle = 'Insertion Sort';
  }
  /**insertion sort end */

  /* quick sort start*/
  quicksort() {
    this.sorting = true;
    this.resetArray = true;
    this.processQuicksort(0, this.items.length - 1);
  }

  processQuicksort(start: number, end: number) {
    if (end - start > 1) {
      let low = start;
      let pivot = end;
      let high = pivot - 1;
      let animation = setInterval(() => {
        this.clearIndex(low);
        this.clearIndex(high);
        this.paintIndexes(low, high, 'red');
        this.ctx.fillStyle = 'green';
        this.fillIndex(pivot);

        for (low; this.items[low] <= this.items[pivot] && low < high;) {
          low++;
        }

        for (high; this.items[high] > this.items[pivot] && low < high;) {
          high--;
        }

        if (low == high) {
          clearInterval(animation);
          this.paintIndexes(pivot, high, 'green');
          this.swapItems(pivot, high);
          setTimeout(() => {
            this.clearIndex(pivot);
            this.clearIndex(high);
            this.paintIndexes(pivot, high, 'red');
            if (low > start) {
              this.processQuicksort(start, low);
            }
            if (high < end) {
              this.processQuicksort(high, end);
            }
          }, this.animationTime);
        } else if (this.items[low] > this.items[high]) {
          this.paintIndexes(low, high, 'blue');
          this.swapItems(low, high);
        }
      }, this.animationTime);

      this.animationList.push(animation);
    } else {
      if (this.items[start] > this.items[end]) {
        this.paintIndexes(start, end, 'blue');
        this.swapItems(start, end);
        setTimeout(() => {
          this.clearIndex(start);
          this.clearIndex(end);
          this.paintIndexes(start, end, 'red');
        }, this.animationTime);
      }
    }
  }

  setQuicksort() {
    this.reset();
    this.sortingAlgorithm = SortingAlgorithm.QUICK_SORT;
    this.algorithmTitle = 'Quicksort';
  }
  /* quick sort end*/

  // mergesort start
  mergeSort() {
    this.sorting = true;
    this.resetArray = false;
    let merge = this.mergeSortDivide(this.items, 0).subscribe(val => {
      this.resetArray = true;
      merge.unsubscribe();
    });
  }

  mergeSortDivide(arr: number[], canvasIndex: number): Observable<number[]> {
    return Observable.create(observer => {
      if (arr.length > 1) {
        let splitIndex = Math.floor(arr.length / 2);
        let leftArr = arr.slice(0, splitIndex);
        let rightArr = arr.slice(splitIndex, arr.length);
        let leftDivide = this.mergeSortDivide(leftArr, canvasIndex);
        let rightDivide = this.mergeSortDivide(rightArr, splitIndex);

        let combine = combineLatest(leftDivide, rightDivide).subscribe(([la, ra]) => {
          let merge = this.mergeSortMerge(la, ra, canvasIndex).subscribe(val => {
            this.mergeSwap(val, canvasIndex);
            this.paintRange(canvasIndex, val.length, 'red');
            observer.next(val);
            combine.unsubscribe();
            merge.unsubscribe();
          })
        });
      } else {
        observer.next(arr);
      }
    });
  }

  mergeSortMerge(leftArr: number[], rightArr: number[], canvasIndex: number): Observable<number[]> {
    //position of end index of the two arrays  refrenced to original array
    let endIndex = canvasIndex + leftArr.length + rightArr.length;
    let leftIndex = 0;
    let rightIndex = 0;
    let temp: number[] = [];
    this.paintRange(canvasIndex, endIndex, 'blue');
    return Observable.create(observer => {
      let timer = interval(this.animationTime).subscribe(val => {
        
        if (leftIndex < leftArr.length && rightIndex < rightArr.length) {
          if (leftArr[leftIndex] < rightArr[rightIndex]) {
            temp.push(leftArr[leftIndex]);
            this.paintIndex(canvasIndex + leftIndex, 'green');
            leftIndex++;
          } else {
            temp.push(rightArr[rightIndex]);
            this.paintIndex(canvasIndex + rightIndex + leftArr.length, 'green');
            rightIndex++;
          }
        } else if (leftIndex < leftArr.length) {
          temp.push(leftArr[leftIndex]);
          this.paintIndex(canvasIndex + leftIndex, 'green');
          leftIndex++;
        } else if (rightIndex < rightArr.length) {
          temp.push(rightArr[rightIndex]);
          this.paintIndex(canvasIndex + rightIndex + leftArr.length, 'green');
          rightIndex++;
        } else {
          observer.next(temp);
          timer.unsubscribe();
        }
      });
    });
  }

  mergeSwap(arr: number[], canvasIndex) {
    for (let i = 0; i < arr.length; i++) {
      this.items[canvasIndex + i] = arr[i]
    }
  }

  setMergeSort() {
    this.reset();
    this.sortingAlgorithm = SortingAlgorithm.MERGE_SORT;
    this.algorithmTitle = 'Merge Sort';
  }
  // mergesort end

  getAnimateTime() {
    return this.animationTime;
  }
}

export enum SortingAlgorithm {
  BUBBLE_SORT,
  QUICK_SORT,
  MERGE_SORT,
  INSERTION_SORT
}

