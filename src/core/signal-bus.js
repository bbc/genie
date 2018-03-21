import fpflow from "lodash/fp/flow";

export const create = () => {
    const _bus = {};

    const addSignal = message => {
        if (!_bus[message.name]) {
            _bus[message.name] = new Phaser.Signal();
        }
        return message;
    };

    const remove = name => {
        _bus[name].dispose();
        delete _bus[name];
    };

    const addSubscription = message => _bus[message.name].add(message.callback);
    const publishMessage = message => _bus[message.name].dispatch(message.data);

    const subscribe = fpflow(addSignal, addSubscription);
    const publish = fpflow(addSignal, publishMessage);

    return { remove, subscribe, publish };
};

//Single instance
export const bus = create();
