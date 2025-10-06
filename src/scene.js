import * as THREE from 'https://esm.sh/three';

export function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    const camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        0.01,
        100
    );
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // 💡 Сильный равномерный свет
    const ambient = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambient);

    // 💡 Дополнительный источник сверху
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // 💡 Яркий точечный свет в центре комнаты
    const pointLight = new THREE.PointLight(0xffffff, 3.5, 100);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // Для отладки — видно источник
    const helper = new THREE.PointLightHelper(pointLight, 0.5);
    scene.add(helper);

    // ------ 

    // Оси координат
    scene.add(new THREE.AxesHelper(2));

    // Обработка ресайза
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Обработка скролла мыши
    window.addEventListener('wheel', event => {
        const delta = event.deltaY * 0.01;
        camera.position.z += delta;
        camera.position.z = Math.max(2, Math.min(50, camera.position.z));
        camera.lookAt(0, 0, 0);
    });

    return { scene, camera, renderer };
}
