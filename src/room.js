import * as THREE from 'https://esm.sh/three';

const room1Textures = {
  wall1: '../textures/right.jpg',
  wall2: '../textures/left.jpg',
  wall3: '../textures/wall_2.jpg',
  wall4: '../textures/wall_2.jpg',
  wall5: '../textures/door.jpg',
  wall6: '../textures/front.jpg'
};

const room1Colors = {
  wall1: 0x8888aa,
  wall2: 0x8888aa,
  wall3: 0xaaaaaa,
  wall4: 0x444444,
  wall5: 0x8888aa,
  wall6: 0xffffff
};

const room2Textures = {
  wall1: '../textures/right2.jpg',
  wall2: '../textures/left2.jpg',
  wall3: '../textures/wall_2.jpg',
  wall4: '../textures/wall_2.jpg',
  wall5: '../textures/door2.jpg',
  wall6: '../textures/front2.jpg'
};

const room2Colors = {
  wall1: 0xffaaaa,
  wall2: 0xaaffaa,
  wall3: 0xaaaaff,
  wall4: 0xffffaa,
  wall5: 0xffaaff,
  wall6: 0xaaffff
};

function makeMat(path, fallbackColor) {
  const loader = new THREE.TextureLoader();
  const url = new URL(path, import.meta.url).href;
  let ok = true;
  const tex = loader.load(
    url,
    t => t.encoding = THREE.sRGBEncoding,
    undefined,
    () => { ok = false; }
  );
  return ok
    ? new THREE.MeshStandardMaterial({ map: tex, side: THREE.BackSide })
    : new THREE.MeshStandardMaterial({ color: fallbackColor, side: THREE.BackSide });
}

function loadMaterials(textures, colors) {
  return [
    makeMat(textures.wall1, colors.wall1), // right
    makeMat(textures.wall2, colors.wall2), // left
    makeMat(textures.wall3, colors.wall3), // top
    makeMat(textures.wall4, colors.wall4), // bottom
    makeMat(textures.wall5, colors.wall5), // front
    makeMat(textures.wall6, colors.wall6)  // back
  ];
}

export function createRoom(scene, camera, onRoomSwitch) {
  const roomSize = { width: 16, height: 9, depth: 16 };

  // Геометрия комнаты
  const geometry = new THREE.BoxGeometry(roomSize.width, roomSize.height, roomSize.depth);
  const materials = loadMaterials(room1Textures, room1Colors);

  // убрать потолок (index 2) и пол (index 3)
  geometry.clearGroups();
  const facesPerSide = 2;
  const indicesPerFace = 3 * facesPerSide;
  for (let i = 0; i < 6; i++) {
    if (i === 2 || i === 3) continue; // пропускаем верх и низ
    geometry.addGroup(i * indicesPerFace, indicesPerFace, i);
  }

  const roomMesh = new THREE.Mesh(geometry, materials);
  scene.add(roomMesh);

  // Кнопки вращения камеры
  const rotateLeftBtn = document.createElement('button');
  rotateLeftBtn.textContent = '⟲ -90°';
  rotateLeftBtn.className = 'fixed-button left';

  const rotateRightBtn = document.createElement('button');
  rotateRightBtn.textContent = '⟳ +90°';
  rotateRightBtn.className = 'fixed-button right';

  document.body.appendChild(rotateLeftBtn);
  document.body.appendChild(rotateRightBtn);

  let angle = 0;

  function updateCameraRotation() {
    const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
    const y = camera.position.y;
    camera.position.set(
      radius * Math.sin(angle),
      y,
      radius * Math.cos(angle)
    );
    camera.lookAt(0, 0, 0);
  }

  rotateLeftBtn.onclick = () => {
    angle += Math.PI / 2;
    updateCameraRotation();
  };
  rotateRightBtn.onclick = () => {
    angle -= Math.PI / 2;
    updateCameraRotation();
  };

  // Переключение между комнатами
  // создаём кнопку
  const switchRoomBtn = document.createElement('button');
  switchRoomBtn.textContent = 'Перейти в комнату 2';
  switchRoomBtn.className = 'fixed-button top-right';
  document.body.appendChild(switchRoomBtn);

  let inRoom1 = true;
  let roomId = 1;

  // 👉 выносим всю логику в отдельную функцию
  function switchRoom() {
    const textures = inRoom1 ? room2Textures : room1Textures;
    const colors = inRoom1 ? room2Colors : room1Colors;
    const newMats = loadMaterials(textures, colors);

    geometry.clearGroups();
    for (let i = 0; i < 6; i++) {
      if (i === 2 || i === 3) continue; // пропускаем верх и низ
      geometry.addGroup(i * indicesPerFace, indicesPerFace, i);
    }

    roomMesh.material = newMats;

    // переключаем флаг и roomId
    inRoom1 = !inRoom1;
    roomId = inRoom1 ? 1 : 2;

    switchRoomBtn.textContent = inRoom1 ? 'Перейти в комнату 2' : 'Перейти в комнату 1';
    console.log('Текущая комната:', roomId);

    if (typeof onRoomSwitch === 'function') {
      onRoomSwitch(roomId);
    }
  }

  // 👉 при клике вызываем ту же функцию
  switchRoomBtn.addEventListener('click', switchRoom);

  // 👉 и сразу вызываем при создании комнаты

  angle -= Math.PI / 2;
  updateCameraRotation();

  switchRoom();
}
