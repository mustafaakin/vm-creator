#!/bin/bash
base=/home/mustafa/buki

cpu=$1
memory=$2
disksize=$3
name=$4
bridge=$5
mac=$6

folder=$base/vms/$name
folderregex="\/home\/mustafa\/buki\/vms\/$name"


echo "Creating VM Folder"
mkdir -p $base/vms/$name
echo "Copying Base image"
cp $base/images/ubuntu1404.{xml,img} $folder/
echo "Resizing the image"
qemu-img resize $folder/ubuntu1404.img $disksize
echo "Editing the Definition"

sed -i.bak s/NAME/$name/g              $folder/ubuntu1404.xml
sed -i.bak s/MEMORY/$memory/g          $folder/ubuntu1404.xml
sed -i.bak s/CPU/$cpu/g                $folder/ubuntu1404.xml
sed -i.bak s/FOLDER/$folderregex/g     $folder/ubuntu1404.xml
sed -i.bak s/BRIDGE/$bridge/g          $folder/ubuntu1404.xml
sed -i.bak s/MAC/$mac/g                $folder/ubuntu1404.xml


echo "Creating user image for data"

echo "#cloud-config"               >> $folder/user-data
echo "password: ubuntu"            >> $folder/user-data
echo "hostname: $name"             >> $folder/user-data
echo "ssh_pwauth: True"            >> $folder/user-data
cloud-localds $folder/user-data.img $folder/user-data

echo "Creating VM"
virsh destory $name
virsh undefine $name
virsh define $folder/ubuntu1404.xml
virsh start $name