import * as THREE from 'https://esm.sh/three';

export function createPreviewPlanes(scene, camera, renderer, roomId = 1) {
  const defaultRadius = 0.5;   // радиус круга по умолчанию
  const segments = 32;         // сегменты для круга

  // данные для разных комнат
  const itemsRoom1 = [
    {
      name: 'tv',
      isModel: false,
      images: ['/3D/photos/tv_1.jpg', '/3D/photos/tv_2.jpg'],
      position: { x: 8, y: -1, z: -2.9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      color: 0xffffff,
      opacity: 0.5,
      radius: 1,
      height: 0.8
    },
    {
      name: 'torchere',
      isModel: false,
      images: ['/3D/photos/torchere_1.jpg', '/3D/photos/torchere_2.jpg', '/3D/photos/torchere_3.jpg'],
      position: { x: -8, y: -0.5, z: 3.8 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      color: 0xffffff,
      opacity: 0.5,
      radius: 1,
      height: 0.5
    },
    {
      name: 'sofa',
      isModel: false,
      images: ['/3D/photos/sofa_1.jpg', '/3D/photos/sofa_2.jpg', '/3D/photos/sofa_3.jpg'],
      position: { x: -8, y: -2.5, z: 0 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      color: 0xffffff,
      opacity: 0.5,
      radius: 1,
      height: 0.5
    },
    {
      name: 'sewing',
      isModel: false,
      images: ['/3D/photos/sewing_1.jpg', '/3D/photos/sewing_2.jpg', '/3D/photos/sewing_3.jpg', '/3D/photos/sewing_4.jpg',],
      position: { x: 0.5, y: -0.5, z: 8 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      color: 0xfffffff,
      opacity: 0.5
    },
    {
      name: 'siphon',
      isModel: false,
      images: ['/3D/photos/siphon_1.jpg', '/3D/photos/siphon_2.jpg', '/3D/photos/siphon_3.jpg'],
      position: { x: -1.5, y: -0.8, z: 8 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      color: 0xfffffff,
      opacity: 0.5
    },
    
  ];

  const itemsRoom2 = [
    {
      name: 'passport',
      isModel: true,
      modelUrl: '/3D/models/passport.glb',
      position: { x: 8, y: -0.8, z: 2.9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      color: 0x8A9A5B,
      opacity: 0.5
    },
    {
      name: 'bages',
      isModel: false,
      images: ['/3D/photos/badges_1.jpg', '/3D/photos/badges_2.jpg', '/3D/photos/badges_3.jpg', '/3D/photos/badges_5.jpg'],
      position: { x: 8, y: -0.8, z: 0.5 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      color: 0xffffff,
      opacity: 0.5
    },
    {
      name: 'money',
      isModel: false,
      images: [
        '/3D/photos/money_1.jpg', '/3D/photos/money_2.jpg', '/3D/photos/money_3.jpg', '/3D/photos/money_4.jpg',
        '/3D/photos/money_5.jpg', '/3D/photos/money_6.jpg', '/3D/photos/money_7.jpg', '/3D/photos/money_8.jpg'
      ],
      position: { x: 8, y: -0.8, z: 1.7 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      color: 0xffffff,
      opacity: 0.5
    },
    {
      name: 'docs',
      isModel: false,
      images: [
        '/3D/photos/docs_1.jpg', '/3D/photos/docs_2.jpg', '/3D/photos/docs_3.jpg', '/3D/photos/docs_4.jpg',
        '/3D/photos/docs_5.jpg', '/3D/photos/docs_6.jpg', '/3D/photos/docs_7.jpg', '/3D/photos/docs_8.jpg'
      ],
      position: { x: 8, y: -0.8, z: 4.1 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      color: 0xffffff,
      opacity: 0.5
    },
    {
      name: 'typewriter',
      isModel: false,
      images: ['/3D/photos/typewriter_1.jpg', '/3D/photos/typewriter_2.jpg', '/3D/photos/typewriter_3.jpg', '/3D/photos/typewriter_4.jpg'],
      position: { x: 1, y: -1.5, z: 8 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      color: 0xffffff,
      opacity: 0.5
    },
    {
      name: 'iron',
      isModel: false,
      images: ['/3D/photos/iron_1.jpg', '/3D/photos/iron_2.jpg', '/3D/photos/iron_3.jpg',],
      position: { x: -2, y: -2.2, z: 8 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      color: 0xffffff,
      opacity: 0.5
    },
    {
      name: 'radio',
      isModel: false,
      images: ['/3D/photos/radio_1.jpg', '/3D/photos/radio_2.jpg', '/3D/photos/radio_3.jpg',],
      position: { x: -2.1, y: -1.4, z: 8 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      color: 0xffffff,
      opacity: 0.5,
      radius: 0.4
    },
    {
      name: "smena",
      isModel: true,
      modelUrl: '/3D/models/smena_8m2.glb',
      position: { x: 0.5, y: -0.5, z: -8 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      color: 0x8A9A5B,
      opacity: 0.5,
      radius: 0.5   // 👉 пример: круг большего радиуса
    },
    
  ];

  const items = roomId === 1 ? itemsRoom1 : itemsRoom2;

  const planes = [];

  items.forEach(item => {
    let geometry;

    if (item.width && item.height) {
      // 👉 если заданы width/height — прямоугольник
      geometry = new THREE.PlaneGeometry(item.width, item.height);
    } else {
      // 👉 иначе круг (с кастомным радиусом или дефолтным)
      const r = item.radius || defaultRadius;
      geometry = new THREE.CircleGeometry(r, segments);
    }

    const material = new THREE.MeshBasicMaterial({
      color: item.color,
      transparent: true,
      opacity: item.opacity,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(item.position.x, item.position.y, item.position.z);

    if (item.rotation) {
      mesh.rotation.set(
        item.rotation.x || 0,
        item.rotation.y || 0,
        item.rotation.z || 0
      );
    } else {
      mesh.rotation.y = Math.PI;
    }

    if (item.isModel) {
      mesh.userData.isModel = true;
      mesh.userData.modelUrl = item.modelUrl;
    } else {
      mesh.userData.isSlider = true;
      mesh.userData.images = item.images;
    }

    scene.add(mesh);
    planes.push(mesh);
  });

  // 👉 Добавляем наведение курсора
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planes);

    if (intersects.length > 0) {
      renderer.domElement.style.cursor = 'pointer';
    } else {
      renderer.domElement.style.cursor = 'default';
    }
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove);

  return planes;
}
