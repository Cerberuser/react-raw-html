import * as React from "react";

interface IProps {
    onError?: (error: Error) => void;
}

interface IState {
    error: boolean;
}

export class ErrorBoundary extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {error: false};
    }

    componentDidCatch(error: Error): void {
        if (this.props.onError) {
            this.props.onError(error);
        }
    }

    static getDerivedStateFromError() {
        return {error: true};
    }

    render() {
        return this.state.error ? null : this.props.children;
    }

}
