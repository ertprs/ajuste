export default function styles (theme) {
  return (
    {
      root: {
        padding: '10px',
        flexGrow: 1
      },
      textField: {
        marginLeft: '10px',
        marginRight: '10px',
        width: 200
      },
      help: {
        'font': '#FF0000'
      },
      addAdjusment: {
        float: 'right',
        cursor: 'pointer',
        marginLeft: '15px',
        color: '#4caf50',
        fontSize: '40px'
      },
      error: {
        float: 'right',
        cursor: 'not-allowed',
        marginLeft: '15px',
        opacity: 0.2,
        color: '#4caf50',
        fontSize: '40px'
      }
    }
  )
}
