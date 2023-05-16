import renderer from "react-test-renderer";
import RootPage from "@/app/page";
import Image from "next/image";

it("Clicking image triggers rerender and state update", () => {
  // Will fire Image "alt" error see:
  // https://stackoverflow.com/questions/69104923/next-js-empty-alt-tag-when-using-image-component
  // Override creation see:
  // https://github.com/mui/material-ui/issues/27154
  const component = renderer.create(<RootPage></RootPage>, {
    createNodeMock: (node) => {
      return document.createElement(node.type);
    },
  });

  let image = component.root.findByType(Image);
  renderer.act(() => {
    image.props.onClick();
  });

  let homeWrapper = component.root.children[0];
  expect(homeWrapper.props.currKey).toBe(1);
});
