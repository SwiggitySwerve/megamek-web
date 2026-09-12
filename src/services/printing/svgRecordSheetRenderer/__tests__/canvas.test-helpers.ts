/**
 * Shared Image / canvas / object-URL mocks for SVG rasterization tests.
 */

export interface MockCanvasContext {
  drawImage: jest.Mock;
  scale: jest.Mock;
  setTransform: jest.Mock;
  fillRect: jest.Mock;
  fillStyle: string;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: string;
}

export interface MockCanvas {
  width: number;
  height: number;
  getContext: jest.Mock;
  toDataURL: jest.Mock;
  ctx: MockCanvasContext;
}

const OriginalImage = global.Image;
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

export function createMockCanvas(): MockCanvas {
  const ctx: MockCanvasContext = {
    drawImage: jest.fn(),
    scale: jest.fn(),
    setTransform: jest.fn(),
    fillRect: jest.fn(),
    fillStyle: '',
    imageSmoothingEnabled: false,
    imageSmoothingQuality: 'low',
  };

  const canvas: MockCanvas = {
    width: 0,
    height: 0,
    getContext: jest.fn().mockReturnValue(ctx),
    toDataURL: jest.fn((type = 'image/png') => {
      if (type === 'image/jpeg') {
        return 'data:image/jpeg;base64,jpeg-payload';
      }
      return 'data:image/png;base64,png-payload';
    }),
    ctx,
  };

  return canvas;
}

export function installSvgImageMock(options?: { fail?: boolean }): {
  createObjectURL: jest.Mock;
  revokeObjectURL: jest.Mock;
} {
  const createObjectURL = jest.fn(() => 'blob:svg-record-sheet');
  const revokeObjectURL = jest.fn();

  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;

  class MockImage {
    onload: ((this: GlobalEventHandlers, ev: Event) => unknown) | null = null;
    onerror: ((this: GlobalEventHandlers, ev: Event) => unknown) | null = null;
    complete = false;
    naturalWidth = 0;
    naturalHeight = 0;
    private currentSrc = '';

    set src(value: string) {
      this.currentSrc = value;
      queueMicrotask(() => {
        if (options?.fail) {
          this.onerror?.call(
            this as unknown as GlobalEventHandlers,
            new Event('error'),
          );
          return;
        }
        this.complete = true;
        this.naturalWidth = 576;
        this.naturalHeight = 756;
        this.onload?.call(
          this as unknown as GlobalEventHandlers,
          new Event('load'),
        );
      });
    }

    get src(): string {
      return this.currentSrc;
    }
  }

  global.Image = MockImage as unknown as typeof Image;

  return { createObjectURL, revokeObjectURL };
}

export function restoreSvgImageMock(): void {
  global.Image = OriginalImage;
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
}
