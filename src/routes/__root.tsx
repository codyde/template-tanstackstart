import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Header />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        {/* SentryVibe Selection Script - enables element selection in preview */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                let isInspectorActive = false;
                let inspectorStyle = null;
                let highlightedElement = null;
                let highlightOverlay = null;
                let mouseHandler = null;
                let clickHandler = null;

                function createHighlightOverlay() {
                  if (highlightOverlay) return highlightOverlay;
                  const overlay = document.createElement('div');
                  overlay.id = '__sentryvibe-highlight';
                  overlay.style.cssText = 'position: absolute; pointer-events: none; border: 2px solid #7553FF; background: rgba(117, 83, 255, 0.1); z-index: 999999; transition: all 0.1s ease; box-shadow: 0 0 0 1px rgba(117, 83, 255, 0.3), 0 0 20px rgba(117, 83, 255, 0.4);';
                  document.body.appendChild(overlay);
                  highlightOverlay = overlay;
                  return overlay;
                }

                function removeHighlightOverlay() {
                  if (highlightOverlay) { highlightOverlay.remove(); highlightOverlay = null; }
                }

                function highlightElement(element) {
                  if (!element || !isInspectorActive) { removeHighlightOverlay(); return; }
                  const rect = element.getBoundingClientRect();
                  const overlay = createHighlightOverlay();
                  overlay.style.left = rect.left + window.scrollX + 'px';
                  overlay.style.top = rect.top + window.scrollY + 'px';
                  overlay.style.width = rect.width + 'px';
                  overlay.style.height = rect.height + 'px';
                  highlightedElement = element;
                }

                function generateSelector(element) {
                  const testId = element.getAttribute('data-testid');
                  if (testId) return '[data-testid="' + testId + '"]';
                  if (element.id) return '#' + element.id;
                  const classes = Array.from(element.classList).filter(c => !c.match(/^(hover:|focus:|active:|group-|animate-|transition-)/) && !c.includes(':')).slice(0, 3).join('.');
                  if (classes) {
                    const tagName = element.tagName.toLowerCase();
                    try {
                      const selector = tagName + '.' + classes;
                      const matches = document.querySelectorAll(selector);
                      if (matches.length === 1) return selector;
                      const parent = element.parentElement;
                      if (parent) { const siblings = Array.from(parent.children); const index = siblings.indexOf(element) + 1; return selector + ':nth-child(' + index + ')'; }
                      return selector;
                    } catch (err) {}
                  }
                  return getFullPath(element);
                }

                function getFullPath(element) {
                  const path = [];
                  let current = element;
                  while (current && current !== document.body) {
                    let selector = current.tagName.toLowerCase();
                    if (current.id) { selector += '#' + current.id; path.unshift(selector); break; }
                    const parent = current.parentElement;
                    if (parent) { const siblings = Array.from(parent.children).filter(child => child.tagName === current.tagName); if (siblings.length > 1) { const index = siblings.indexOf(current) + 1; selector += ':nth-of-type(' + index + ')'; } }
                    path.unshift(selector);
                    current = current.parentElement;
                  }
                  return path.join(' > ');
                }

                function captureElementData(element, clickEvent) {
                  const rect = element.getBoundingClientRect();
                  return {
                    selector: generateSelector(element),
                    tagName: element.tagName.toLowerCase(),
                    className: element.className,
                    id: element.id,
                    textContent: element.textContent?.trim().slice(0, 100),
                    innerHTML: element.innerHTML?.slice(0, 200),
                    attributes: Array.from(element.attributes).reduce((acc, attr) => { acc[attr.name] = attr.value; return acc; }, {}),
                    boundingRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                    clickPosition: { x: clickEvent.clientX, y: clickEvent.clientY },
                    computedStyles: { backgroundColor: window.getComputedStyle(element).backgroundColor, color: window.getComputedStyle(element).color, fontSize: window.getComputedStyle(element).fontSize, fontFamily: window.getComputedStyle(element).fontFamily }
                  };
                }

                function handleMouseMove(e) { if (!isInspectorActive) return; const element = e.target; if (element && element !== highlightedElement) highlightElement(element); }

                function handleClick(e) {
                  if (!isInspectorActive) return;
                  e.preventDefault(); e.stopPropagation();
                  const element = e.target;
                  const data = captureElementData(element, e);
                  window.parent.postMessage({ type: 'sentryvibe:element-selected', data }, '*');
                  setInspectorActive(false);
                }

                function setInspectorActive(active) {
                  isInspectorActive = active;
                  if (active) {
                    if (!inspectorStyle) { inspectorStyle = document.createElement('style'); inspectorStyle.textContent = '.inspector-active * { cursor: crosshair !important; }'; document.head.appendChild(inspectorStyle); }
                    document.body.classList.add('inspector-active');
                    if (!mouseHandler) { mouseHandler = handleMouseMove; clickHandler = handleClick; document.addEventListener('mousemove', mouseHandler, true); document.addEventListener('click', clickHandler, true); }
                  } else {
                    document.body.classList.remove('inspector-active');
                    highlightedElement = null;
                    removeHighlightOverlay();
                    if (mouseHandler) { document.removeEventListener('mousemove', mouseHandler, true); document.removeEventListener('click', clickHandler, true); mouseHandler = null; clickHandler = null; }
                    if (inspectorStyle) { inspectorStyle.remove(); inspectorStyle = null; }
                  }
                }

                window.addEventListener('message', (e) => { if (e.data.type === 'sentryvibe:toggle-selection-mode') setInspectorActive(e.data.enabled); });
                window.parent.postMessage({ type: 'sentryvibe:ready' }, '*');
              })();
            `,
          }}
        />
        <Scripts />
      </body>
    </html>
  )
}
