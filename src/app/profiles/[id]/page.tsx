import React from "react";

function ProfileId({ params }: { params: {id: string}}) {
  return <div>ProfileId: {params?.id}</div>;
}

export default ProfileId;
