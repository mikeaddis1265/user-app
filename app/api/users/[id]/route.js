import prisma from '../../../../lib/prisma'

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: body,
    });
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await prisma.users.delete({
      where: { id: Number(id) },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Delete failed' }), { status: 500 });
  }
}