import { Area } from '@ant-design/plots';

export default function Chart({ data }) {

    const config = {
        data,
        xField: 'date',
        yField: 'close',
        xAxis: {
            range: [0, 1],
            tickCount: 5,
        },
        areaStyle: () => {
            return {
                fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
            };
        },
    };

    return <Area {...config} />;
}
