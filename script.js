document.addEventListener('DOMContentLoaded', function () {
    const dslFunctions = {
        rot90: { before: [[1, 2], [3, 4]], after: [[3, 1], [4, 2]] },
        hmirror: { before: [[1, 2, 3], [4, 5, 6]], after: [[4, 5, 6], [1, 2, 3]] },
        vmirror: { before: [[1, 2, 3], [4, 5, 6]], after: [[3, 2, 1], [6, 5, 4]] },
        tophalf: { before: [[1, 1], [2, 2], [3, 3], [4, 4]], after: [[1, 1], [2, 2]] },
        bottomhalf: { before: [[1, 1], [2, 2], [3, 3], [4, 4]], after: [[3, 3], [4, 4]] },
        vconcat: { input1: [[1, 1], [2, 2]], input2: [[3, 3]], after: [[1, 1], [2, 2], [3, 3]] },
        hconcat: { input1: [[1], [2]], input2: [[3, 3]], after: [[1, 3, 3], [2, 0, 0]] }
    };

    const dslButtonsContainer = document.getElementById('dsl-buttons');
    const dslDisplayContainer = document.getElementById('dsl-display');

    function createGrid(gridData) {
        const gridEl = document.createElement('div');
        gridEl.className = 'arc-grid';
        if (!gridData || gridData.length === 0 || gridData[0].length === 0) return gridEl;
        gridEl.style.gridTemplateColumns = `repeat(${gridData[0].length}, 1fr)`;
        gridData.forEach(row => {
            row.forEach(cell => {
                const cellEl = document.createElement('div');
                cellEl.className = `arc-cell color-${cell}`;
                gridEl.appendChild(cellEl);
            });
        });
        return gridEl;
    }

    Object.keys(dslFunctions).forEach(name => {
        const button = document.createElement('button');
        button.textContent = name;
        button.className = 'w-full bg-white text-slate-700 px-3 py-2 text-sm rounded-md font-semibold border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2';
        button.onclick = () => showDslExample(name);
        dslButtonsContainer.appendChild(button);
    });

    function showDslExample(name) {
        const funcData = dslFunctions[name];
        dslDisplayContainer.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-wrap items-center justify-center gap-4 md:gap-6';

        if (funcData.before) {
            const beforeDiv = createLabeledGrid('Input', funcData.before);
            wrapper.appendChild(beforeDiv);
        } else {
            const before1Div = createLabeledGrid('Input 1', funcData.input1);
            const before2Div = createLabeledGrid('Input 2', funcData.input2);
            wrapper.appendChild(before1Div);
            wrapper.appendChild(before2Div);
        }

        const arrow = document.createElement('div');
        arrow.textContent = '→';
        arrow.className = 'text-4xl font-light text-slate-300';
        wrapper.appendChild(arrow);

        const afterDiv = createLabeledGrid('Output', funcData.after);
        wrapper.appendChild(afterDiv);

        dslDisplayContainer.appendChild(wrapper);
    }

    function createLabeledGrid(label, gridData) {
        const container = document.createElement('div');
        container.className = 'flex flex-col items-center space-y-2';
        const title = document.createElement('p');
        title.className = 'text-sm font-medium text-slate-600';
        title.textContent = label;
        container.appendChild(title);
        container.appendChild(createGrid(gridData));
        return container;
    }

    const walkthroughBtn = document.getElementById('walkthrough-btn');
    const walkthroughContainer = document.getElementById('walkthrough-container');
    let currentStep = -1;
    const steps = [
        { label: 'Start: Input "I"', grid: [[1, 2, 3, 4], [5, 6, 7, 8]] },
        { label: 'x1: tophalf(I)', grid: [[1, 2, 3, 4]] },
        { label: 'x2: rot90(x1)', grid: [[1], [2], [3], [4]] },
        { label: 'O: vconcat(x2, I)', grid: [[1, 0, 0, 0], [2, 0, 0, 0], [3, 0, 0, 0], [4, 0, 0, 0], [1, 2, 3, 4], [5, 6, 7, 8]] }
    ];

    walkthroughBtn.onclick = () => {
        currentStep = (currentStep + 1) % steps.length;
        renderWalkthrough();
    };

    function renderWalkthrough() {
        walkthroughContainer.innerHTML = '';
        walkthroughBtn.textContent = 'Next Step';

        const activeSteps = steps.slice(0, currentStep + 1);

        activeSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'flex flex-col items-center';

            const gridDiv = createLabeledGrid(step.label, step.grid);
            stepDiv.appendChild(gridDiv);

            walkthroughContainer.appendChild(stepDiv);

            if (index < activeSteps.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'flowchart-arrow my-4';
                walkthroughContainer.appendChild(arrow);
            }
        });

        if (currentStep === steps.length - 1) {
            walkthroughBtn.textContent = 'Restart Walkthrough';
        }
    }
});
