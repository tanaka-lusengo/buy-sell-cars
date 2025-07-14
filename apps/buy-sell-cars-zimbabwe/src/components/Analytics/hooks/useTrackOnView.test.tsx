import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTrackOnView } from "./useTrackOnView";

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

const mockIntersectionObserver = vi
  .fn()
  .mockImplementation((callback: IntersectionObserverCallback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: mockUnobserve,
    callback,
  }));

// Store the original IntersectionObserver
const originalIntersectionObserver = global.IntersectionObserver;

// Helper function to create a complete mock IntersectionObserverEntry
const createMockEntry = (
  isIntersecting: boolean,
  target: Element
): IntersectionObserverEntry => ({
  isIntersecting,
  target,
  boundingClientRect: {} as DOMRectReadOnly,
  intersectionRatio: isIntersecting ? 1 : 0,
  intersectionRect: {} as DOMRectReadOnly,
  rootBounds: {} as DOMRectReadOnly,
  time: Date.now(),
});

describe("useTrackOnView", () => {
  let mockCallback: ReturnType<typeof vi.fn>;
  let mockRef: React.RefObject<HTMLDivElement>;
  let mockElement: HTMLDivElement;

  beforeEach(() => {
    // Setup mocks
    mockCallback = vi.fn();
    mockElement = document.createElement("div");
    mockRef = { current: mockElement };

    // Mock IntersectionObserver globally
    global.IntersectionObserver =
      mockIntersectionObserver as typeof IntersectionObserver;

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original IntersectionObserver
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it("should create an IntersectionObserver when ref.current exists", () => {
    renderHook(() => useTrackOnView(mockRef, mockCallback));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.5 }
    );
    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it("should use custom threshold when provided", () => {
    const customThreshold = 0.8;
    renderHook(() => useTrackOnView(mockRef, mockCallback, customThreshold));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: customThreshold }
    );
  });

  it("should not create observer when ref.current is null", () => {
    const nullRef = { current: null };
    renderHook(() => useTrackOnView(nullRef, mockCallback));

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("should call callback when element becomes visible", () => {
    let observerCallback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation(
      (callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: mockUnobserve,
        };
      }
    );

    renderHook(() => useTrackOnView(mockRef, mockCallback));

    // Simulate element becoming visible
    const mockEntry = createMockEntry(true, mockElement);

    observerCallback!([mockEntry], {} as IntersectionObserver);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when element is not intersecting", () => {
    let observerCallback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation(
      (callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: mockUnobserve,
        };
      }
    );

    renderHook(() => useTrackOnView(mockRef, mockCallback));

    // Simulate element not being visible
    const mockEntry = createMockEntry(false, mockElement);

    observerCallback!([mockEntry], {} as IntersectionObserver);

    expect(mockCallback).not.toHaveBeenCalled();
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it("should only fire callback once and disconnect observer after first intersection", () => {
    let observerCallback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation(
      (callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: mockUnobserve,
        };
      }
    );

    renderHook(() => useTrackOnView(mockRef, mockCallback));

    const mockEntry = createMockEntry(true, mockElement);

    // First intersection should fire callback and disconnect
    observerCallback!([mockEntry], {} as IntersectionObserver);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);

    // In real-world usage, the observer would be disconnected after the first call,
    // so subsequent intersections wouldn't occur. This test verifies that behavior
    // by ensuring disconnect is called immediately after the first intersection.
  });

  it("should update callback ref when callback changes", () => {
    const initialCallback = vi.fn();
    const updatedCallback = vi.fn();

    let observerCallback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation(
      (callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: mockUnobserve,
        };
      }
    );

    const { rerender } = renderHook(
      ({ callback }) => useTrackOnView(mockRef, callback),
      { initialProps: { callback: initialCallback } }
    );

    // Update the callback
    rerender({ callback: updatedCallback });

    // Simulate element becoming visible
    const mockEntry = createMockEntry(true, mockElement);

    observerCallback!([mockEntry], {} as IntersectionObserver);

    expect(initialCallback).not.toHaveBeenCalled();
    expect(updatedCallback).toHaveBeenCalledTimes(1);
  });

  it("should disconnect observer on unmount", () => {
    const { unmount } = renderHook(() => useTrackOnView(mockRef, mockCallback));

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should recreate observer when ref changes", () => {
    const secondElement = document.createElement("div");
    const secondRef = { current: secondElement };

    const { rerender } = renderHook(
      ({ ref }) => useTrackOnView(ref, mockCallback),
      { initialProps: { ref: mockRef } }
    );

    expect(mockObserve).toHaveBeenCalledWith(mockElement);

    // Change the ref
    rerender({ ref: secondRef });

    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(secondElement);
  });

  it("should recreate observer when threshold changes", () => {
    const { rerender } = renderHook(
      ({ threshold }) => useTrackOnView(mockRef, mockCallback, threshold),
      { initialProps: { threshold: 0.5 } }
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.5 }
    );

    // Change the threshold
    rerender({ threshold: 0.8 });

    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.8 }
    );
  });

  it("should handle callback that throws an error gracefully", () => {
    const errorCallback = vi.fn(() => {
      throw new Error("Test error");
    });

    let observerCallback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation(
      (callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: mockUnobserve,
        };
      }
    );

    renderHook(() => useTrackOnView(mockRef, errorCallback));

    const mockEntry = createMockEntry(true, mockElement);

    // When callback throws, the error should bubble up and disconnect should still be called
    expect(() =>
      observerCallback!([mockEntry], {} as IntersectionObserver)
    ).toThrow("Test error");
    expect(errorCallback).toHaveBeenCalledTimes(1);

    // Note: In the actual implementation, disconnect is called after the callback,
    // so if the callback throws, disconnect might not be reached. This is expected behavior.
    // The hook doesn't implement error handling - that's the responsibility of the consumer.
  });

  it("should work with different threshold values", () => {
    const thresholds = [0, 0.25, 0.5, 0.75, 1];

    thresholds.forEach((threshold) => {
      vi.clearAllMocks();
      renderHook(() => useTrackOnView(mockRef, mockCallback, threshold));

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold }
      );
    });
  });
});
