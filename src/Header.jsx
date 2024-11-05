import { memo } from 'react'

const Header = memo(function Header({ data }) {
  console.log('data: ', data)

  return <div>this is header component</div>
})

// const Header = function Header({ data }) {
//   console.log('d', data)

//   return <div>this is header component</div>
// }

export default Header