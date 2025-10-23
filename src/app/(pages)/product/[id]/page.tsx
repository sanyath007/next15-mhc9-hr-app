export default function ProductDetail({ params }: { params: { id: string } }) {
    return <div>Product { params.id }</div>;
}