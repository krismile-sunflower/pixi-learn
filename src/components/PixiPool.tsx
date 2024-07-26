// import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Application, Assets, Container, DisplacementFilter, Sprite, Texture, Ticker, TilingSprite } from 'pixi.js';
import bg from '../assets/pool/background.jpg'
import fish1 from '../assets/pool/fish1.png'
import fish2 from '../assets/pool/fish2.png'
import fish3 from '../assets/pool/fish3.png'
import fish4 from '../assets/pool/fish4.png'
import fish5 from '../assets/pool/fish5.png'
import overlayPng from '../assets/pool/wave_overlay.png'
import displacement from '../assets/pool/displacement_map.png'

type CustomSprite = Sprite & {
    direction: number;
    speed: number;
    turnSpeed: number;
};

function PIXIPool() {
    const ref = useRef<HTMLDivElement>(null)
    let overlay: any;

    // let app = null;
    const init = async () => {
        const app = new Application();
        await app.init({ background: '#1099bb', resizeTo: window });
        const fishes: CustomSprite[] = [];

        // 当元素存在时候，且没有子元素时候，添加canvas，能够保证每次只渲染一次app.canvas
        if (ref.current && !ref.current.hasChildNodes()) {
            ref.current.appendChild(app.canvas);
        }

        await preload();

        addBg(app);

        addFish(app, fishes);

        addWaterOverlay(app);

        addDisplacementEffect(app);

        app.ticker.add((time) => { animateFishes(app, fishes, time); animateWaterOverlay(app, time) });


    }

    const preload = async () => {
        const assets = [
            { alias: 'background', src: bg },
            { alias: 'fish1', src: fish1 },
            { alias: 'fish2', src: fish2 },
            { alias: 'fish3', src: fish3 },
            { alias: 'fish4', src: fish4 },
            { alias: 'fish5', src: fish5 },
            { alias: 'overlay', src: overlayPng },
            { alias: 'displacement', src: displacement },
        ];
        await Assets.load(assets);
    }

    const addBg = (app: Application) => {
        const background = Sprite.from('background');

        background.anchor.set(0.5);
        if (app.screen.width > app.screen.height) {
            background.width = app.screen.width * 1.2;
            background.scale.y = background.scale.x;
        }
        else {
            background.height = app.screen.height * 1.2;
            background.scale.x = background.scale.y;
        }
        background.x = app.screen.width / 2;
        background.y = app.screen.height / 2;

        app.stage.addChild(background);
    }



    const addFish = (app: Application, fishes: CustomSprite[]) => {
        const fishContainer = new Container();

        app.stage.addChild(fishContainer);

        const fishCount = 20;
        const fishAssets = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'];
        for (let i = 0; i < fishCount; i++) {
            // const fish = Sprite.from(fishAssets[Math.floor(Math.random() * fishAssets.length)]);
            const fishAsset = fishAssets[i % fishAssets.length];
            const fish = Sprite.from(fishAsset) as CustomSprite;
            fish.anchor.set(0.5);
            fish.direction = Math.random() * Math.PI * 2;
            fish.speed = 2 + Math.random() * 2;
            fish.turnSpeed = Math.random() - 0.8;


            fish.x = Math.random() * app.screen.width;
            fish.y = Math.random() * app.screen.height;
            fish.scale.set(Math.random() * 0.5 + 0.5);

            fishContainer.addChild(fish);
            fishes.push(fish);
        }
    }

    const animateFishes = (app: Application, fishes: CustomSprite[], time: Ticker) => {
        const delta = time.deltaTime;

        const stagePadding = 100;
        const boundWidth = app.screen.width + stagePadding * 2;
        const boundHeight = app.screen.height + stagePadding * 2;

        fishes.forEach((fish) => {
            fish.direction += fish.turnSpeed * 0.01;
            fish.x += Math.sin(fish.direction) * fish.speed;
            fish.y += Math.cos(fish.direction) * fish.speed;
            fish.rotation = -fish.direction - Math.PI / 2;

            if (fish.x < -stagePadding) {
                fish.x += boundWidth;
            }
            if (fish.x > app.screen.width + stagePadding) {
                fish.x -= boundWidth;
            }
            if (fish.y < -stagePadding) {
                fish.y += boundHeight;
            }
            if (fish.y > app.screen.height + stagePadding) {
                fish.y -= boundHeight;
            }
        });
    }

    const addWaterOverlay = (app: Application) => {
        const texture = Texture.from('overlay');
        overlay = new TilingSprite(texture, app.screen.width, app.screen.height);
        app.stage.addChild(overlay);

    }

    const animateWaterOverlay = (app: Application, time: Ticker) => {
        const delta = time.deltaTime;
        overlay.tilePosition.x -= delta;
        overlay.tilePosition.y -= delta;
    }

    const addDisplacementEffect = (app: Application) => {
        const sprite = Sprite.from('displacement');

        sprite.texture.baseTexture.wrapMode = 'repeat';

        const filter = new DisplacementFilter({
            sprite,
            scale: 50,
            width: app.screen.width,
            height: app.screen.height,
        });

        app.stage.filters = [filter];
    }

    useEffect(() => { init() }, [])
    return (
        <div ref={ref}></div>
    )
}

export default PIXIPool;
