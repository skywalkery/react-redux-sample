import { compose, lifecycle, renderNothing } from 'recompose';

export default compose(
  lifecycle({
    componentDidMount() {
      this.props.bar.backBuyrBar();
    },
  }),
  renderNothing,
)();
