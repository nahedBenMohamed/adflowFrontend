import type { Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { BuilderNavStep } from '../shared';

export class BuilderNavStore {
  steps: BuilderNavStep[] = [];
  stepOrder: number;

  constructor(steps: BuilderNavStep[]) {
    this.steps = steps;
    this.stepOrder = 1;

    makeAutoObservable(this);
  }

  get isCurrentStepFirst(): boolean {
    return this.stepOrder === Math.min(...this.steps.map(s => s.order));
  }

  get isCurrentStepLast(): boolean {
    return this.stepOrder === Math.max(...this.steps.map(s => s.order));
  }

  findStepByOrder = (order: number): Optional<BuilderNavStep> => {
    return this.steps.find(s => s.order === order);
  };

  getStepByOrder = (order: number): BuilderNavStep => {
    const step = this.findStepByOrder(order);

    if (!step) throw new Error(`Step with order ${order} was not found`);

    return step;
  };

  navigateToNextStep = (): void => {
    const nextStep = this.findStepByOrder(this.stepOrder + 1);

    if (!nextStep) return;

    if (nextStep.locked) nextStep.locked = false;

    this.setStepOrder(nextStep.order);
  };

  navigateToPreviousStep = (): void => {
    const previousStep = this.findStepByOrder(this.stepOrder - 1);

    if (!previousStep) return;

    this.setStepOrder(previousStep.order);
  };

  setStepOrder = (order: number): void => {
    this.stepOrder = order;
  };

  unlockAllSteps = (): void => {
    this.steps.forEach(s => {
      s.locked = false;
    });
  };
}
