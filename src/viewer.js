import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://esm.sh/three';

export function initModelViewer(scene, camera, canvas, planesInitial) {
    const loader = new GLTFLoader();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let planes = planesInitial;   // 👉 сюда будем подменять массив плоскостей
    let active = false;
    let activeModel = null;
    let autoRotate = true;

    // Подложка-оверлей
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
        zIndex: '5',
        display: 'none'
    });
    document.body.appendChild(overlay);

    // Кнопка закрытия
    const btn = document.createElement('div');
    btn.innerHTML = `
    <svg viewBox="0 0 24 24" style="width:clamp(20px,3vw,32px);cursor:pointer">
      <circle cx="12" cy="12" r="11" stroke="white" stroke-width="2"/>
      <line x1="8" y1="8" x2="16" y2="16" stroke="white" stroke-width="2"/>
      <line x1="16" y1="8" x2="8" y2="16" stroke="white" stroke-width="2"/>
    </svg>`;
    Object.assign(btn.style, {
        position: 'absolute',
        top: 'clamp(10px,2vh,20px)',
        right: 'clamp(10px,2vw,20px)',
        zIndex: '10',
        display: 'none'
    });
    btn.onclick = deactivate;
    document.body.appendChild(btn);

    // Клик по canvas для выбора объекта
    canvas.addEventListener('click', e => {
        if (active) return;

        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hit = raycaster.intersectObjects(planes, false);

        function createImageSlider(images) {
            const slider = document.createElement('div');
            slider.className = 'image-slider';
            Object.assign(slider.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '9999'
            });

            let index = 0;
            const img = document.createElement('img');
            img.src = images[index];
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            slider.appendChild(img);

            // кнопка закрытия
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✖';
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '24px',
                background: 'transparent',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
            });
            slider.appendChild(closeBtn);

            // кнопки "влево" и "вправо"
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '←';
            Object.assign(prevBtn.style, {
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '32px',
                background: 'transparent',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
            });
            slider.appendChild(prevBtn);

            const nextBtn = document.createElement('button');
            nextBtn.textContent = '→';
            Object.assign(nextBtn.style, {
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '32px',
                background: 'transparent',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
            });
            slider.appendChild(nextBtn);

            function showImage(i) {
                index = (i + images.length) % images.length;
                img.src = images[index];
            }
            prevBtn.addEventListener('click', e => {
                e.stopPropagation();
                showImage(index - 1);
            });
            nextBtn.addEventListener('click', e => {
                e.stopPropagation();
                showImage(index + 1);
            });

            // закрытие
            function close() {
                document.body.removeChild(slider);
                document.removeEventListener('keydown', escHandler);
            }
            closeBtn.addEventListener('click', e => {
                e.stopPropagation();
                close();
            });

            function escHandler(e) {
                if (e.key === 'Escape') close();
            }
            document.addEventListener('keydown', escHandler);

            document.body.appendChild(slider);
        }


        if (hit.length) {
            const obj = hit[0].object;
            if (obj.userData.isModel && obj.userData.modelUrl) {
                loadModel(obj.userData.modelUrl);
            } else if (obj.userData.isSlider && obj.userData.images) {
                createImageSlider(obj.userData.images); // ✅ вернули слайдер
            }
        }
    });

    function scaleToFit(object, maxSize = 0.5) {
        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > maxSize) {
            const scale = maxSize / maxDim;
            object.scale.setScalar(scale);
        }
    }

    function loadModel(url) {
        active = true;
        btn.style.display = 'block';
        overlay.style.display = 'block';

        loader.load(
            url,
            gltf => {
                if (activeModel) scene.remove(activeModel);
                activeModel = gltf.scene;
                scaleToFit(activeModel);

                const dir = new THREE.Vector3();
                camera.getWorldDirection(dir);
                activeModel.position.copy(camera.position.clone().add(dir.multiplyScalar(2)));

                activeModel.lookAt(0, 0, 0);
                scene.add(activeModel);
            },
            undefined,
            () => { active = false; btn.style.display = 'none'; overlay.style.display = 'none'; }
        );
    }

    function deactivate() {
        if (!active) return;
        active = false;
        btn.style.display = 'none';
        overlay.style.display = 'none';
        if (activeModel) {
            scene.remove(activeModel);
            activeModel = null;
        }
    }

    // Вращение мышью через overlay
    let dragging = false;
    let prev = { x: 0, y: 0 };

    overlay.addEventListener('mousedown', (e) => {
        if (active && e.button === 0) {
            dragging = true;
            autoRotate = false;
            prev.x = e.clientX;
            prev.y = e.clientY;
        }
    });

    window.addEventListener('mouseup', () => {
        if (dragging) {
            dragging = false;
            autoRotate = true;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (active && dragging && activeModel) {
            const dx = e.clientX - prev.x;
            const dy = e.clientY - prev.y;
            activeModel.rotation.y += dx * 0.01;
            activeModel.rotation.x += dy * 0.01;
            prev.x = e.clientX;
            prev.y = e.clientY;
        }
    });

    // Автоповорот
    function animateRotation() {
        if (active && activeModel && autoRotate) {
            activeModel.rotation.y += 0.015;
        }
        requestAnimationFrame(animateRotation);
    }
    animateRotation();

    // 👉 возвращаем объект с методом updatePlanes
    return {
        updatePlanes(newPlanes) {
            planes = newPlanes;
        }
    };
}
