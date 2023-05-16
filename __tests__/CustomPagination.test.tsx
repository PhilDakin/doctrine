import renderer from "react-test-renderer";
import CustomPagination from "@/app/CustomPagination";

it("CustomPagination snapshot match", () => {
  const component = renderer.create(
    <CustomPagination setPage={jest.fn()}></CustomPagination>
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
