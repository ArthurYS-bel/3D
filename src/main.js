import { initScene } from './scene.js';
import { createRoom } from './room.js';
import { createPreviewPlanes } from './previews.js';
import { initModelViewer } from './viewer.js';

const { scene, camera, renderer } = initScene();

let roomId = 1; // текущая комната
let planes = createPreviewPlanes(scene, camera, renderer, roomId);
const viewer = initModelViewer(scene, camera, renderer.domElement, planes);

// создаём комнату и передаём колбэк для переключения
createRoom(scene, camera, (newRoomId) => {
  roomId = newRoomId;

  // удалить старые плоскости
  planes.forEach(p => scene.remove(p));
  // создать новые плоскости для новой комнаты
  planes = createPreviewPlanes(scene, camera, renderer, roomId);

  // уведомить viewer об обновлении набора плоскостей
  viewer.updatePlanes(planes);
});

function showIntroOverlay() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.color = '#fff';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.padding = '2rem';
  overlay.style.fontFamily = 'sans-serif';
  overlay.style.textAlign = 'center';

  overlay.innerHTML = `
    <h1 style="font-size:2rem; margin-bottom:1rem;">Интерактивная 3D-комната</h1>
    <p style="max-width:600px; font-size:1.1rem; line-height:1.5;">
      Это виртуальное пространство, где вы можете исследовать экспонаты музея.
      Кликайте по <strong>круглым меткам</strong> — они открывают 3D-модели или изображения.
      Используйте кнопки <strong>⟲ / ⟳</strong> для вращения камеры, а <strong>«Перейти в комнату»</strong> — чтобы сменить обстановку.
    </p>
    <p style="margin-top:1rem; font-size:1rem;">
      3D модели отмечены зелёным цветом, белым отмечены фотографии
    </p>
    <button style="
      margin-top:2rem;
      padding:0.8rem 1.5rem;
      font-size:1rem;
      background:#00cc88;
      color:#fff;
      border:none;
      border-radius:8px;
      cursor:pointer;
    ">Начать</button>
  `;

  const startBtn = overlay.querySelector('button');
  startBtn.onclick = () => document.body.removeChild(overlay);

  document.body.appendChild(overlay);
}

showIntroOverlay();



renderer.setAnimationLoop(() => renderer.render(scene, camera));
