export const renderData = {
  nodes: [
    {
      id: '21', // 节点ID，需要全局唯一，不传入内部会自动生成一个ID
      type: 'rect', // 节点类型，可以传入LogicFlow内置的7种节点类型，也可以注册自定义节点后传入自定义类型
      x: 100, // 节点形状中心在x轴位置
      y: 100, // 节点形状中心在y轴的位置
      text: 'Origin Usage-rect', // 节点文本
      properties: {
        // 自定义属性，用于存储需要这个节点携带的信息，可以传入宽高以重设节点的宽高
        width: 160,
        height: 80,
      },
    },
    {
      id: '50',
      type: 'circle',
      x: 300,
      y: 300,
      text: 'Origin Usage-circle',
      properties: {
        r: 60,
      },
    },
  ],
  // 边数据
  edges: [
    {
      id: 'rect-2-circle', // 边ID，性质与节点ID一样
      type: 'polyline', // 边类型
      sourceNodeId: '50', // 起始节点Id
      targetNodeId: '21', // 目标节点Id
    },
  ],
};
