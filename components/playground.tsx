export function InlinePlayground(props: { reference: string; children: any[] }) {
  let playgroundUrl = "https://play.authzed.com";
  return (
    <div className="my-6">
      <iframe
        style={{ width: "100%", border: "0px", height: "500px" }}
        src={`${playgroundUrl}/i/${props.reference}`}
      ></iframe>
    </div>
  );
}
