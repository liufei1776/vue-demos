export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  // 这个函数就是绘制palette的核心
  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory } = this;

    const createTask = () => {
      return (event) => {
        const bizObj = bpmnFactory.create('bpmn:Task');
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          bizObj,
        });
        create.start(event, shape);
      };
    };

    // 返回创建的个性化
    return {
      'lfeish-task': {
        group: 'model',
        title: 'lfeish task',
        className: 'bpmn-icon-task red',
        action: {
          dragstart: createTask(),
          click: createTask(),
        },
      },
    };
  }
}

CustomPalette.$inject = ['bpmnFactory', 'create', 'elementFactory', 'palette', 'translate'];
