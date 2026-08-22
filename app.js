const templates = {
  front: { name: 'Jewel Case Front', size: 'A4 quer · 2 Flächen', className: 'front-template', pdfAsset: 'assets/JEWEL CASE template FRONT.pdf', pageRatio: 0.7071, zones: [{ key: 'front-inside', x: 9.273, y: 21.404, w: 40.744, h: 57.615 }, { key: 'front', x: 50, y: 21.404, w: 40.744, h: 57.615 }] },
  back: { name: 'Jewel Case Back / Inlay', size: 'A4 hoch · Back + Stege', className: 'back-template', pdfAsset: 'assets/JEWEL CASE template BACK.pdf', pageRatio: 1.4142, zones: [{ key: 'back', x: 14.046, y: 10.27, w: 71.912, h: 39.731 }, { key: 'back-inside', x: 14.046, y: 50, w: 71.912, h: 39.731 }, { key: 'side-left', x: 11.53, y: 10.27, w: 2.516, h: 79.46 }, { key: 'side-right', x: 85.958, y: 10.27, w: 2.516, h: 79.46 }] },
  cd: { name: 'Runde CD', size: 'A4 hoch · 2 CDs', className: 'cd-template', pdfAsset: 'assets/CD DISC PRINT.pdf', pageRatio: 1.4069, zones: [{ key: 'cd-top', x: 23.366, y: 8.73, w: 55.365, h: 39.37, circle: true }, { key: 'cd-bottom', x: 23.366, y: 54.0, w: 55.365, h: 39.37, circle: true }] },
};

const artboard = document.querySelector('#artboard');
const activeName = document.querySelector('#activeTemplateName');
const activeSize = document.querySelector('#activeTemplateSize');
const zoomLabel = document.querySelector('#zoomLabel');
const printLandscape = document.querySelector('#printLandscape');
let zoom = 1;
let selectedImage = null;
let activeTemplateKey = 'front';
const templateImages = { front: [], back: [], cd: [] };
let panX = 0;
let panY = 0;
let productPreview = false;

document.querySelectorAll('.template-card').forEach((button) => {
  button.addEventListener('click', () => {
    templateImages[activeTemplateKey] = [...artboard.querySelectorAll('.placed-image')];
    document.querySelector('.template-card.active').classList.remove('active');
    button.classList.add('active');
    activeTemplateKey = button.dataset.template;
    const template = templates[button.dataset.template];
    selectedImage = null;
    artboard.querySelectorAll('.placed-image').forEach((element) => element.remove());
    templateImages[activeTemplateKey].forEach((image) => artboard.append(image));
    artboard.className = `artboard ${template.className}`;
    renderTemplateGuides(template);
    activeName.textContent = template.name;
    activeSize.textContent = template.size;
    updatePrintOrientation();
    updateLayerPanel();
    updateResizeHandles();
  });
});

function renderTemplateGuides(template = templates.front) {
  const guides = document.querySelector('#templateGuides');
  const zones = template.zones.map((zone) => `<div class="edit-zone ${zone.circle ? 'circle-zone' : ''}" data-zone="${zone.key}" style="left:${zone.x}%;top:${zone.y}%;width:${zone.w}%;height:${zone.h}%"></div>`).join('');
  const viewHeight = 100 * template.pageRatio;
  const maskZones = template.zones.map((zone) => zone.circle ? `<circle cx="${zone.x + zone.w / 2}" cy="${zone.y * template.pageRatio + zone.w / 2}" r="${zone.w / 2}" fill="black" />` : `<rect x="${zone.x}" y="${zone.y * template.pageRatio}" width="${zone.w}" height="${zone.h * template.pageRatio}" fill="black" />`).join('');
  const cutMarks = template.zones.filter((zone) => !zone.key.startsWith('side-')).map((zone) => {
    const y = zone.y * template.pageRatio;
    if (zone.circle) return `<circle cx="${zone.x + zone.w / 2}" cy="${y + zone.w / 2}" r="${zone.w / 2}" />`;
    const x = zone.x; const right = zone.x + zone.w; const bottom = y + zone.h * template.pageRatio; const arm = 1.8;
    return `<path d="M ${x - arm} ${y} H ${x + arm} M ${x} ${y - arm} V ${y + arm} M ${right - arm} ${y} H ${right + arm} M ${right} ${y - arm} V ${y + arm} M ${x - arm} ${bottom} H ${x + arm} M ${x} ${bottom - arm} V ${bottom + arm} M ${right - arm} ${bottom} H ${right + arm} M ${right} ${bottom - arm} V ${bottom + arm}" />`;
  }).join('');
  const mask = `<svg class="product-mask" viewBox="0 0 100 ${viewHeight}" preserveAspectRatio="none" aria-hidden="true"><defs><mask id="cutMask"><rect width="100" height="${viewHeight}" fill="white" />${maskZones}</mask></defs><rect width="100" height="${viewHeight}" fill="#11151acc" mask="url(#cutMask)" /></svg>`;
  const printCutLayer = `<svg class="print-cut-lines" viewBox="0 0 100 ${viewHeight}" preserveAspectRatio="none" aria-hidden="true">${cutMarks}</svg>`;
  guides.innerHTML = `${mask}${zones}${printCutLayer}`;
}
renderTemplateGuides();
function updatePrintOrientation() {
  printLandscape.disabled = activeTemplateKey !== 'front';
}
updatePrintOrientation();

function setZoom(nextZoom) {
  zoom = Math.min(4, Math.max(0.25, nextZoom));
  document.querySelector('#artboardWrap').style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  if (typeof updateResizeHandles === 'function') updateResizeHandles();
}
document.querySelector('#zoomIn').addEventListener('click', () => setZoom(zoom + 0.25));
document.querySelector('#zoomOut').addEventListener('click', () => setZoom(zoom - 0.25));
document.querySelector('#fitButton').addEventListener('click', () => setZoom(1));

const canvasArea = document.querySelector('#canvasArea');
canvasArea.addEventListener('wheel', (event) => {
  event.preventDefault();
  setZoom(zoom + (event.deltaY < 0 ? 0.1 : -0.1));
}, { passive: false });
canvasArea.addEventListener('pointerdown', (event) => {
  if (event.button !== 1) return;
  event.preventDefault();
  const startX = event.clientX; const startY = event.clientY;
  const originX = panX; const originY = panY;
  artboard.classList.add('pan-active');
  const move = (moveEvent) => {
    panX = originX + moveEvent.clientX - startX;
    panY = originY + moveEvent.clientY - startY;
    setZoom(zoom);
  };
  const stop = () => {
    artboard.classList.remove('pan-active');
    canvasArea.removeEventListener('pointermove', move);
    canvasArea.removeEventListener('pointerup', stop);
  };
  canvasArea.addEventListener('pointermove', move);
  canvasArea.addEventListener('pointerup', stop);
});

document.querySelector('#productToggle').addEventListener('click', () => {
  productPreview = !productPreview;
  document.querySelector('#productToggle').classList.toggle('active', productPreview);
  document.querySelector('#templateGuides').classList.toggle('product-preview', productPreview);
});
document.querySelector('#exportButton').addEventListener('click', async () => {
  updatePrintOrientation();
  productPreview = true;
  document.querySelector('#productToggle').classList.add('active');
  document.querySelector('#templateGuides').classList.add('product-preview');
  if (window.designerSassNative?.exportPdf) {
    const placements = [...artboard.querySelectorAll('.placed-image')].map((image) => ({
      data: image.src,
      left: image.offsetLeft,
      top: image.offsetTop,
      width: image.offsetWidth,
      height: image.offsetHeight,
      rotation: Number(image.dataset.rotation || 0),
    }));
    try {
      const result = await window.designerSassNative.exportPdf({ template: activeTemplateKey, placements });
      if (!result?.canceled) window.alert(`PDF gespeichert: ${result.filename}`);
    } catch (error) {
      window.alert(`PDF-Export fehlgeschlagen: ${error.message}`);
    }
    return;
  }
  window.print();
});
const dropzone = document.querySelector('#dropzone');
const fileInput = document.querySelector('#fileInput');
['dragenter', 'dragover'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
  event.preventDefault(); dropzone.classList.add('dragging');
}));
['dragleave', 'drop'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
  event.preventDefault(); dropzone.classList.remove('dragging');
}));
dropzone.addEventListener('drop', (event) => importFiles(event.dataTransfer.files));
fileInput.addEventListener('change', (event) => importFiles(event.target.files));

function importFiles(files) {
  [...files].filter((file) => file.type.startsWith('image/')).forEach((image) => {
    const reader = new FileReader();
    reader.onload = () => {
      document.querySelector('.empty-art').style.display = 'none';
      const imageElement = document.createElement('img');
      imageElement.src = reader.result;
      imageElement.className = 'placed-image';
      imageElement.alt = image.name;
      imageElement.draggable = false;
      artboard.append(imageElement);
      imageElement.addEventListener('pointerdown', makeDraggable);
      imageElement.addEventListener('dragstart', (event) => event.preventDefault());
      imageElement.addEventListener('click', () => selectImage(imageElement));
      imageElement.addEventListener('load', () => placeImageInMatchingZone(imageElement, image.name));
      selectImage(imageElement);
    };
    reader.readAsDataURL(image);
  });
}

function placeImageInMatchingZone(image, filename) {
  const templateKey = activeTemplateKey;
  const zones = templates[templateKey].zones;
  const name = filename.toLowerCase();
  let zoneIndex = 0;
  if (templateKey === 'front' && name.includes('front') && !name.includes('inside')) zoneIndex = 1;
  if (templateKey === 'back' && (name.includes('inside') || name.includes('inlay'))) zoneIndex = 1;
  if (templateKey === 'cd' && name.includes('cd')) zoneIndex = 0;
  const zone = zones[zoneIndex];
  if (!zone) return;
  image.dataset.zone = zone.key;
  image.style.left = `${zone.x / 100 * artboard.clientWidth}px`;
  image.style.top = `${zone.y / 100 * artboard.clientHeight}px`;
  applyFitMode(image, image.dataset.fitMode || 'contain');
  document.querySelector('#layerName').textContent = `${filename} · ${zone.key}`;
}

function applyFitMode(image, mode) {
  const zone = templates[activeTemplateKey].zones.find((candidate) => candidate.key === image.dataset.zone);
  if (!zone) return;
  const zoneWidth = zone.w / 100 * artboard.clientWidth;
  const zoneHeight = zone.circle ? zoneWidth : zone.h / 100 * artboard.clientHeight;
  image.dataset.fitMode = mode;
  image.dataset.scale = '100';
  image.style.objectFit = mode === 'cover' ? 'cover' : 'contain';
  image.style.maxHeight = 'none';
  if (mode === 'cover') {
    image.dataset.baseWidth = String(zoneWidth);
    image.dataset.baseHeight = String(zoneHeight);
    image.style.width = `${zoneWidth}px`;
    image.style.height = `${zoneHeight}px`;
    image.style.left = `${zone.x / 100 * artboard.clientWidth}px`;
    image.style.top = `${zone.y / 100 * artboard.clientHeight}px`;
    return;
  }
  const fitScale = Math.min(zoneWidth / image.naturalWidth, zoneHeight / image.naturalHeight);
  const fittedWidth = image.naturalWidth * fitScale;
  const fittedHeight = image.naturalHeight * fitScale;
  image.dataset.baseWidth = String(fittedWidth);
  image.dataset.baseHeight = String(fittedHeight);
  image.style.width = `${fittedWidth}px`;
  image.style.height = `${fittedHeight}px`;
  image.style.left = `${zone.x / 100 * artboard.clientWidth + (zoneWidth - fittedWidth) / 2}px`;
  image.style.top = `${zone.y / 100 * artboard.clientHeight + (zoneHeight - fittedHeight) / 2}px`;
}

function selectImage(image) {
  selectedImage?.classList.remove('selected');
  selectedImage = image;
  selectedImage.classList.add('selected');
  document.querySelector('#scaleControl').value = selectedImage.dataset.scale || '100';
  document.querySelector('#scaleOutput').textContent = `${document.querySelector('#scaleControl').value}%`;
  document.querySelector('#rotationControl').value = selectedImage.dataset.rotation || '0';
  document.querySelector('#rotationOutput').textContent = `${document.querySelector('#rotationControl').value}°`;
  document.querySelector('#layersEmpty').hidden = true;
  document.querySelector('#layerItem').hidden = false;
  document.querySelector('#elementProperties').hidden = false;
  document.querySelector('#layerCount').textContent = String(artboard.querySelectorAll('.placed-image').length);
  document.querySelector('#layerName').textContent = image.alt || 'Bild';
  updateResizeHandles();
}

const resizeHandles = document.querySelector('#resizeHandles');
function updateResizeHandles() {
  resizeHandles.hidden = !selectedImage;
  if (!selectedImage) return;
  const artRect = artboard.getBoundingClientRect();
  const left = selectedImage.offsetLeft;
  const top = selectedImage.offsetTop;
  const width = selectedImage.offsetWidth;
  const height = selectedImage.offsetHeight;
  const positions = { nw: [left - 5, top - 5], ne: [left + width - 5, top - 5], sw: [left - 5, top + height - 5], se: [left + width - 5, top + height - 5] };
  Object.entries(positions).forEach(([key, [x, y]]) => {
    const handle = resizeHandles.querySelector(`[data-handle="${key}"]`);
    handle.style.left = `${x}px`; handle.style.top = `${y}px`;
  });
}

resizeHandles.querySelectorAll('i').forEach((handle) => {
  handle.addEventListener('pointerdown', (event) => {
    event.preventDefault(); event.stopPropagation();
    if (!selectedImage) return;
    handle.setPointerCapture?.(event.pointerId);
    canvasArea.classList.add('resizing');
    const direction = handle.dataset.handle;
    const startX = event.clientX; const startY = event.clientY;
    const startLeft = selectedImage.offsetLeft; const startTop = selectedImage.offsetTop;
    const startWidth = selectedImage.offsetWidth; const startHeight = selectedImage.offsetHeight;
    const ratio = startWidth / startHeight || 1;
    const move = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / zoom;
      const dy = (moveEvent.clientY - startY) / zoom;
      const horizontal = direction.includes('e') ? startWidth + dx : startWidth - dx;
      const newWidth = Math.max(20, horizontal);
      const newHeight = newWidth / ratio;
      selectedImage.style.width = `${newWidth}px`;
      selectedImage.style.height = `${newHeight}px`;
      const scale = Number(document.querySelector('#scaleControl').value) / 100;
      selectedImage.dataset.baseWidth = String(newWidth / scale);
      selectedImage.dataset.baseHeight = String(newHeight / scale);
      if (direction.includes('w')) selectedImage.style.left = `${startLeft + startWidth - newWidth}px`;
      if (direction.includes('n')) selectedImage.style.top = `${startTop + startHeight - newHeight}px`;
      updateResizeHandles();
    };
    const stop = () => {
      handle.releasePointerCapture?.(event.pointerId);
      canvasArea.classList.remove('resizing');
      resizeHandles.removeEventListener('pointermove', move);
      resizeHandles.removeEventListener('pointerup', stop);
      resizeHandles.removeEventListener('pointercancel', stop);
    };
    resizeHandles.addEventListener('pointermove', move); resizeHandles.addEventListener('pointerup', stop);
    resizeHandles.addEventListener('pointercancel', stop);
  });
});

function updateLayerPanel() {
  const elements = artboard.querySelectorAll('.placed-image');
  document.querySelector('#layerCount').textContent = String(elements.length);
  document.querySelector('#layersEmpty').hidden = elements.length !== 0;
  document.querySelector('#layerItem').hidden = elements.length === 0;
  document.querySelector('#elementProperties').hidden = !selectedImage;
  if (selectedImage) document.querySelector('#layerName').textContent = `${selectedImage.alt} · ${selectedImage.dataset.zone || 'frei'}`;
  document.querySelector('.empty-art').style.display = elements.length ? 'none' : '';
}

document.querySelector('#scaleControl').addEventListener('input', (event) => {
  if (!selectedImage) return;
  const value = Number(event.target.value);
  applyImageTransform();
  updateResizeHandles();
  document.querySelector('#scaleOutput').textContent = `${value}%`;
});
document.querySelector('#rotationControl').addEventListener('input', (event) => {
  if (!selectedImage) return;
  const value = Number(event.target.value);
  applyImageTransform();
  updateResizeHandles();
  document.querySelector('#rotationOutput').textContent = `${value}°`;
});
document.querySelector('#deleteButton').addEventListener('click', deleteSelectedImage);
document.querySelector('#flipHorizontal').addEventListener('click', () => flipSelectedImage('horizontal'));
document.querySelector('#flipVertical').addEventListener('click', () => flipSelectedImage('vertical'));
document.querySelector('#fitContain').addEventListener('click', () => selectedImage && applyFitMode(selectedImage, 'contain'));
document.querySelector('#fitCover').addEventListener('click', () => selectedImage && applyFitMode(selectedImage, 'cover'));
let extendDirection = 'right';
document.querySelectorAll('[data-extend]').forEach((button) => button.addEventListener('click', () => {
  extendDirection = button.dataset.extend;
  document.querySelectorAll('[data-extend]').forEach((item) => item.classList.toggle('active', item === button));
}));
document.querySelector('#extendControl').addEventListener('input', (event) => {
  document.querySelector('#extendOutput').textContent = `${event.target.value}%`;
});
document.querySelector('#extendApply').addEventListener('click', () => extendSelectedImage(extendDirection, Number(document.querySelector('#extendControl').value)));

function extendSelectedImage(direction, percent) {
  if (!selectedImage) return;
  const image = selectedImage;
  const source = new Image();
  source.onload = () => {
    const horizontal = direction === 'left' || direction === 'right';
    const edgeLength = horizontal ? source.width : source.height;
    const addedSourcePixels = Math.max(1, Math.round(edgeLength * percent / 100));
    const canvas = document.createElement('canvas');
    canvas.width = source.width + (horizontal ? addedSourcePixels : 0);
    canvas.height = source.height + (horizontal ? 0 : addedSourcePixels);
    const context = canvas.getContext('2d');
    const offsetX = direction === 'left' ? addedSourcePixels : 0;
    const offsetY = direction === 'top' ? addedSourcePixels : 0;
    context.drawImage(source, offsetX, offsetY);
    const patchSize = Math.max(8, Math.round((horizontal ? source.width : source.height) * 0.12));
    context.save();
    context.filter = `blur(${Math.max(2, Math.round(patchSize * 0.06))}px)`;
    if (direction === 'left') context.drawImage(source, 0, 0, patchSize, source.height, 0, 0, addedSourcePixels, source.height);
    if (direction === 'right') context.drawImage(source, source.width - patchSize, 0, patchSize, source.height, source.width, 0, addedSourcePixels, source.height);
    if (direction === 'top') context.drawImage(source, 0, 0, source.width, patchSize, 0, 0, source.width, addedSourcePixels);
    if (direction === 'bottom') context.drawImage(source, 0, source.height - patchSize, source.width, patchSize, 0, source.height, source.width, addedSourcePixels);
    context.restore();
    image.src = canvas.toDataURL('image/png');
    const addedDisplayPixels = (direction === 'left' || direction === 'right' ? image.offsetWidth : image.offsetHeight) * percent / 100;
    if (direction === 'left') image.style.left = `${image.offsetLeft - addedDisplayPixels}px`;
    if (direction === 'top') image.style.top = `${image.offsetTop - addedDisplayPixels}px`;
    if (horizontal) image.style.width = `${image.offsetWidth + addedDisplayPixels}px`;
    else image.style.height = `${image.offsetHeight + addedDisplayPixels}px`;
    image.dataset.baseWidth = String(image.offsetWidth);
    image.dataset.baseHeight = String(image.offsetHeight);
    updateResizeHandles();
  };
  source.src = image.src;
}
document.addEventListener('keydown', (event) => {
  if (selectedImage && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    const step = event.shiftKey ? 10 : 1;
    const deltaX = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
    const deltaY = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
    selectedImage.style.left = `${snapPosition(selectedImage.offsetLeft + deltaX, selectedImage.offsetWidth, 'x', selectedImage)}px`;
    selectedImage.style.top = `${snapPosition(selectedImage.offsetTop + deltaY, selectedImage.offsetHeight, 'y', selectedImage)}px`;
    updateResizeHandles();
  }
  if ((event.key === 'Backspace' || event.key === 'Delete') && selectedImage && document.activeElement.tagName !== 'INPUT') {
    event.preventDefault();
    deleteSelectedImage();
  }
});

function deleteSelectedImage() {
  if (!selectedImage) return;
  selectedImage.remove();
  selectedImage = null;
  templateImages[activeTemplateKey] = [...artboard.querySelectorAll('.placed-image')];
  updateLayerPanel();
  updateResizeHandles();
}

function flipSelectedImage(direction) {
  if (!selectedImage) return;
  const key = direction === 'horizontal' ? 'flipX' : 'flipY';
  selectedImage.dataset[key] = selectedImage.dataset[key] === '-1' ? '1' : '-1';
  applyImageTransform();
  updateResizeHandles();
}

function applyImageTransform() {
  if (!selectedImage) return;
  const rotation = document.querySelector('#rotationControl').value;
  const scale = Number(document.querySelector('#scaleControl').value) / 100;
  selectedImage.dataset.scale = String(Math.round(scale * 100));
  selectedImage.dataset.rotation = rotation;
  if (selectedImage.dataset.baseWidth && selectedImage.dataset.baseHeight) {
    selectedImage.style.width = `${Number(selectedImage.dataset.baseWidth) * scale}px`;
    selectedImage.style.height = `${Number(selectedImage.dataset.baseHeight) * scale}px`;
  }
  const flipX = selectedImage.dataset.flipX || '1';
  const flipY = selectedImage.dataset.flipY || '1';
  selectedImage.style.transform = `rotate(${rotation}deg) scale(${Number(flipX)}, ${Number(flipY)})`;
}

function makeDraggable(event) {
  if (event.button !== 0) return;
  event.preventDefault();
  const image = event.currentTarget;
  const startX = event.clientX; const startY = event.clientY;
  const startLeft = image.offsetLeft; const startTop = image.offsetTop;
  image.setPointerCapture?.(event.pointerId);
  const move = (moveEvent) => {
    const nextLeft = startLeft + (moveEvent.clientX - startX) / zoom;
    const nextTop = startTop + (moveEvent.clientY - startY) / zoom;
    image.style.left = `${snapPosition(nextLeft, image.offsetWidth, 'x', image)}px`;
    image.style.top = `${snapPosition(nextTop, image.offsetHeight, 'y', image)}px`;
    if (image === selectedImage) updateResizeHandles();
  };
  const stop = () => { image.releasePointerCapture?.(event.pointerId); image.removeEventListener('pointermove', move); image.removeEventListener('pointerup', stop); image.removeEventListener('pointercancel', stop); };
  image.addEventListener('pointermove', move); image.addEventListener('pointerup', stop);
  image.addEventListener('pointercancel', stop);
}

function snapPosition(value, size, axis, image) {
  const threshold = 12 / zoom;
  const pageSize = axis === 'x' ? artboard.clientWidth : artboard.clientHeight;
  const targets = [0, pageSize - size, pageSize / 2 - size / 2];
  const zone = templates[activeTemplateKey].zones.find((candidate) => candidate.key === image.dataset.zone);
  if (zone) {
    const start = (axis === 'x' ? zone.x : zone.y) / 100 * pageSize;
    const zonePercent = axis === 'x' || !zone.circle ? (axis === 'x' ? zone.w : zone.h) : zone.w;
    const zoneSize = zonePercent / 100 * pageSize;
    const end = start + zoneSize;
    targets.push(start, end - size, start + (zoneSize - size) / 2);
  }
  const closest = targets.reduce((best, target) => Math.abs(value - target) < Math.abs(value - best) ? target : best, value);
  return Math.abs(value - closest) <= threshold ? closest : value;
}
