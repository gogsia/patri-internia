// Shared Leva store — lets any component read/write scene control values
// without prop-drilling. Pass this to useControls(..., { store }) and <LevaPanel store={...} />.
export { levaStore as sceneStore } from 'leva';
